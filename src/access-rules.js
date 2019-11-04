/* eslint-disable */

const roles = {
  ADMIN: 'admin',
  FACILITATOR: 'facilitator',
};
const accessRights = [
  'add_exercises',
  'create_org',
  'selfleaders_org',
  'toolbox',
  'selfleaders_template_library',
  'edit_exercise_settings',
];
// const additionalRules = [
//   rules.LOGGED_IN,
//   rules.ME,
//   rules.GROUP_OWNER,
//   'resultsVaryDependingOnRole',
// ];

const ruleTypes = {
  CURR_USER: 'Current user',
  CURR_USER_ROLE: 'Current user role',
  USER: 'Operated user',
  GROUP: 'Operated group',
};

// const rules = {
//   LOGGED_IN: 'loggedIn',
//   ME: 'me',
//   GROUP_EXISTS: 'groupExists',
//   GROUP_OWNER: 'groupOwner',
//   USER_EXISTS: 'userExists',
// };

const rules = {
  LOGGED_IN: {
    key: 'loggedIn',
    type: ruleTypes.CURR_USER,
    description() {
      return `${this.type} has to be logged in.`;
    },
  },
  ME: {
    key: 'me',
    type: [ruleTypes.CURR_USER, ruleTypes.USER],
    description() {
      return `${this.type[0]} has to be the same as ${this.type[1]}.`;
    },
  },
  GROUP_EXISTS: {
    key: 'groupExists',
    type: ruleTypes.GROUP,
    description() {
      return `${this.type} has to already exist.`;
    },
  },
  GROUP_OWNER: {
    key: 'groupOwner',
    type: [ruleTypes.CURR_USER, ruleTypes.GROUP],
    description() {
      return `${this.type[0]} has to be a creator (owner) of ${this.type[1]}.`;
    },
  },
  USER_EXISTS: {
    key: 'userExists',
    type: ruleTypes.USER,
    description() {
      return `${this.type} has to already exist.`
    },
  },
  ADMIN: {
    key: 'currUserAdmin',
    type: ruleTypes.CURR_USER_ROLE,
    description() {
      return `${this.type} has to be 'admin'`;
    },
  },
  FACILITATOR: {
    key: 'currUserFacilitator',
    type: ruleTypes.CURR_USER_ROLE,
    description() {
      return `${this.type} has to be 'facilitator'`;
    },
  },
};

// ---------MUTATIONS----------

// ACCOUNTS MUTATIONS
export const accountsMutations = {
  changePassword: {
    rules: [rules.LOGGED_IN, rules.ME],
  },
  createUser: {},
  forgotPassword: {},
  loginWithPassword: {},
  logout: {
    rules: [rules.LOGGED_IN, rules.ME],
  },
  resendVerificationEmail: {},
  resetPassword: {},
  verifyEmail: {},
};

// GROUP MUTATIONS
export const groupMutations = {
  __commonRules: [rules.LOGGED_IN],

  createGroup: {
    rules: [{
      $or: [rules.ADMIN, rules.FACILITATOR],
    }],
  },
  setTeamGoal: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupAccess: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupIsTemplate: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]], // FIX: has to be admin only
    },
  },
  updateGroupMultiModulesAccess: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupName: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupPreReflectionState: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
};

// FIX: should check meeting existence
const sessionMutations = {
  addGroupSession: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  removeGroupSession: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupSession: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupSessionWeight: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateMeetingNotes: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
};

// FIX: should check exercise existence
const moduleMutations = {
  addGroupSessionModules: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [
        [roles.ADMIN],
        [roles.FACILITATOR, 'add_exercises'],
      ],
    },
  },
  removeGroupSessionModule: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  stopGroupActiveModules: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupSessionModuleName: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupSessionModuleSettings: {
    rules: [rules.LOGGED_IN], // FIX: has to be allowed for group owner only. No group existence check
    roles: {
      $or: [
        [roles.ADMIN],
        [roles.FACILITATOR, 'edit_exercise_settings'],
      ],
    },
  },
  updateGroupSessionModuleState: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  updateGroupSessionModuleWeight: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
};

const groupTagMutations = {
  addTagToGroup: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
  removeGroupTag: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
};

const groupMembersMutations = {
  addGroupUser: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.USER_EXISTS, { $or: [rules.ME, rules.GROUP_OWNER, roles.ADMIN] }],
  },
  removeGroupUser: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [[roles.ADMIN], [roles.FACILITATOR]],
    },
  },
};

const groupMembersDataMutations = {
  removeAllDemonstrationsInGroupModule: false,
  removeAllPositiveExamplesInGroupModule: false,
  removeAllReflectionsInGroupModule: false,
  removeAllUserValuesInGroup: false,
  removeAllVotesInGroupModule: false,
  removeFocusValuesInGroup: false,
  updateGroupModuleCompletedByUser: false,
  updateGroupOwnOpenAnswersVote: false,
  updateGroupPositiveExamplesVote: false,
  updateGroupSpecifyingBehaviorsVote: false,
  updateUserReflectionChoice: false,
};

const groupPresentationMutations = {
  startPresentation: false,
  stopPresentation: false,
  switchMeetingPresentation: false,
  togglePauseOnPresentation: false,
};

// USER MUTATIONS
const userMutations = {
  changeUserEmail: false,
  hideUserCongratulationMessage: false,
  removeUser: false,
  userEnteredModule: false,
};

const userRolesMutations = {
  addUserRole: false,
  removeUserRole: false,
};

const userDataMutations = {
  updateUserActiveGroup: false,
  updateUserFocusValue: false,
  updateUserFocusValues: false,
  updateUserValues: false,
  updateUserDemonstrations: false,
  addUserDemonstrations: false,
  updateUserPositiveExamples: false,
  addUserPositiveExample: false,
  updateUserVotes: false,
  updateUserOwnQuestions: false,
  updateUserOwnQuestionWeight: false,
  updateUserOwnAnswers: false,
  updateUserStrengths: false,
  removeUserFocusValuesInGroup: false,
  removeUserValuesInGroup: false,
  removeUserDemonstrationsInGroup: false,
  removeUserPositiveExamplesInGroup: false,
  removeUserReflectionsInGroup: false,
  removeUserVotesInGroup: false,
  updateLastViewedGroup: false,
  updateCurrentSelectedGroup: false,
  removeUserOwnQuestion: false,
  updateModuleUserInputs: false,
};

// CARDS (MOTIVATIONAL FACTORS, DEV AREA, TOP PRIORITIES) MUTATIONS
const cardMutations = {
  updateCard: false,
  deleteCard: false,
};

// ORGANISATION MUTATIONS
const organisationMutations = {
  createOrganisation: false,
  editOrganisation: false,
};

// TAGS MUTATIONS
const tagsMutations = {
  addGroupTag: false,
  updateTag: false,
  deleteTag: false,
};

// TEAM GOAL MUTATIONS
const teamGoalMutations = {
  updateTeamGoal: false,
};

// ---------MUTATIONS END----------

// ---------QUERIES----------

// GROUPS QUERIES
const groupsQueries = {
  groupForUnauthorised: false,
  group: false,
  groups: false,
};

// ORGANISATIONS QUERIES
const organisationsQueries = {
  organisation: false,
  organisations: false,
};

// CARDS (MOTIVATIONAL FACTORS, DEV AREA, TOP PRIORITIES) QUERIES
const cardsQueries = {
  card: false,
  cards: false, // deprecated
};

// VALUE CATEGORIES QUERIES
const valueCategoriesQueries = {
  categories: false,
};

// VALUES QUERIES
const valuesQueries = {
  values: false,
};

// MEETINGS (SESSIONS) QUERIES
const meetingsQueries = {
  meeting: false,
  meetings: false,
};

// EXERCISES (GROUP MODULES) QUERIES
const exercisesQueries = {
  activeExercise: false,
  exercise: false,
  exercises: false,
};

// MODULES QUERIES
const modulesQueries = {
  modules: false,
};

// OWN QUESTIONS QUERIES
const ownQuestionsQueries = {
  ownQuestions: false,
};

// PRESENTATIONS QUERIES
const presentationsQueries = {
  presentations: false,
  currentPresentation: false,
};

// STRENGTHS QUERIES
const strengthsQueries = {
  strengths: false,
};

// TAGS QUERIES
const tagsQueries = {
  tag: false,
  tags: false,
};

// USERS QUERIES
const usersQueries = {
  loggedInUserId: false,
  user: false,
  users: false,
  usersCount: false,
  groupMembersCount: false,
  orgMembersCount: false,
  me: false, // deprecated
};

// USERS DATA QUERIES (DEPRECATED)
const usersDataQueries = {
  positiveExamples: false, // deprecated
  specifyingBehaviors: false, // deprecated
  ratingImportanceAndActing: false, // deprecated
};

// LANGUAGES QUERIES
const languagesQueries = {
  languages: false,
};

// ---------QUERIES END----------
