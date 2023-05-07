import { injectable } from "inversify";
import { FindOneOptions, Repository } from "typeorm";
import { Project } from "../models/project.entity";
import connectDB from "../utils/db.connection";
import { Member } from "../models/member.entity";
import { Currency } from "../models/currency.entity";
import { Transaction } from "../models/transaction.entity";

@injectable()
export class ProjectService {
  public async findOne(options: FindOneOptions<Project>) {
    return await this.projectRepository.findOne(options);
  }

  public async deleteProject(id: string) {
    const options: FindOneOptions<Project> = {
      where: { id: parseInt(id) },
    };
    const project = await this.findOne(options);
    if (!project) {
      return;
    }
    return await this.projectRepository.delete({ id: parseInt(id) });
  }

  private transactionRepository: Repository<Transaction> =
    connectDB.getRepository(Transaction);

  private projectRepository: Repository<Project> =
    connectDB.getRepository(Project);
  private currencyRepository: Repository<Currency> =
    connectDB.getRepository(Currency);
  private memberRepository: Repository<Member> =
    connectDB.getRepository(Member);

  public async getProject(id: string) {
    return await this.projectRepository.findOneBy({ id: parseInt(id) });
  }

  public async getProjects(): Promise<Project[]> {
    const projects = await this.projectRepository.find();
    return projects;
  }

  public async createProject(
    name: string,
    userId: number,
    currency: number,
    description: string
  ): Promise<Project> {
    const aMember = await this.memberRepository.findOneBy({
      user: { id: userId },
    });
    if (!aMember) throw new Error("Invalid arguments");
    const projectFinded = await this.projectRepository.findOneBy({
      name,
      owner: { id: aMember?.id },
      currency: { id: currency },
    });
    if (projectFinded) {
      return projectFinded;
    } else {
      const aCurrency = await this.currencyRepository.findOneByOrFail({
        id: currency,
      });

      const project = new Project();
      project.name = name;
      project.description = description;
      project.owner = aMember!;
      project.currency = aCurrency;
      project.balance = 0;

      return await this.projectRepository.save(project);
    }
  }

  public async updateProject(
    id: number,
    owner: number,
    currency: number,
    transations: any
  ) {
    const aProject = await this.projectRepository.findOneByOrFail({ id });
    const aCurrency = await this.currencyRepository.findOneByOrFail({
      id: currency,
    });
    const aMember = await this.memberRepository.findOneByOrFail({ id: owner });
    const aTransactions: Transaction[] =
      await this.transactionRepository.findBy({ id: transations });

    aProject.owner = aMember;
    aProject.currency = aCurrency;
    aProject.transactions = aTransactions;

    const updatedProject = await this.projectRepository.save(aProject);

    return updatedProject;
  }
}
