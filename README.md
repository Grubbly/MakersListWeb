# MakersListWeb
Website and core application functionality for MakersList services.

<img src="DepthLogo.png" alt="logo" style="width:100px;height:100px;"/>


## Worklog
- [ ] Create a demoable UI (due 1/29/2019)
- [ ] Rewatch Kanban video (optional)

## Repository

#### Tools
* [ZenHub Addon](https://github.com/marketplace/zenhub)

#### Issue Rules
* All new issues always start in the backlog.
* Issues must clearly and concisely state intention.
* If an issue depends on completing other issue(s) first, reference those issues in the dependencies.

## Kanban
Column | Done Rules
------------ | -------------
Planning | Issue has been broken in subtasks (if applicable) that take at most a single workday to complete.
In Progress | All functionality specified by the issue has been implemented, the code compiles and runs, and comments have been written for code review.
Parking Lot | The functionality required to proceed further with the issue has been implemented.
Review | Reviewer has verified code does what it is suppose to do, is formatted correctly, and contains no code smells.

### Notes:
* When an issue fails to pass any of the columns, particularly review, consider breaking up the task into smaller components or asking for assistance.
* WIP limits are listed at the top of columns in the ZenHub tab.
* If you are working on an issue assign yourself to it.

## Development Material
* The plan is to use Vue and Firebase Firestore and Authentication.
* Vue will serve as the frontend development framework.
* Firebase will provide user accounts and data persistance/associativity.
