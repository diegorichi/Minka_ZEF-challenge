# 🌎 Overview

ZEF is an organization that provides financial services to its members. Members can be both individuals and companies.

Primary services that ZEF wants to provide are:
* allow members to get investment for their projects
* allow members to invest in projects

ZEF manages a digital currency called ZKN (ZEF kuna) that is anchored to HRK (Croatian kuna). When a member pays a membership fee, ZEF credits an account of that member with the same amount of ZKN. Members can then use their available balance to invest in projects.

When a member wants to get investment for a project, he publishes information about his project and creates a new currency that others can buy in order to invest. Implement a service that manages balances of this system.

# 🙋 Actors
* 🏯 Domain Owner - administrator of the whole system
* 🏢 Member - an individual or a company who is paying membership fees

# 🤞 Requirements
* Members can join ZEF
* Members can check their ZEF kuna balances
* Members can send ZEF kunas
* Members can create new projects
* Members can invest in projects

# 🧱 User stories
| As a              | I want to                            | so that I can                                             |
| ----------------- | ------------------------------------ | --------------------------------------------------------- |
| 🏯 Domain owner   | create a new  currency	             | allow members to have a stable currency for exchange      |
| 🏯 Domain owner   | issue currency	                     | represent membership payments, add money to the system    |
| 🏢 Member         | create an account                    | join ZEF                                                  |
| 🏢 Member         | see my account balance               | make investment decisions                                 |
| 🏢 Member         | exchange currency                    | invest in projects by buying their currency               |
| 🏢 Member         | create a new currency                | get investment for a project                              |
| 🏢 Member         | return currency to Domain owner      | withdraw money from the system                            |