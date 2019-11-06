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
  CURR_USER_ACCESS: 'Current user access rights list',
  USER: 'Operated user',
  GROUP: 'Operated group',
  EXERCISE: 'Operated exercise',
  ORGANISATION: 'Operated organisation',
  TAG: 'Operated tag',
  ARGUMENTS: 'Arguments',
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
  GROUP_MEMBER: {
    key: 'groupMember',
    type: [ruleTypes.CURR_USER, ruleTypes.GROUP],
    description() {
      return `${this.type[0]} has to be member of ${this.type[1]}`;
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
  ADD_EXERCISES: {
    key: 'currUserCanAddExercises',
    type: ruleTypes.CURR_USER_ACCESS,
    description() {
      return `${this.type} has to include 'add_exercises' right`;
    },
  },
  EDIT_EXERCISE_SETTINGS: {
    key: 'currUserCanEditExerciseSettings',
    type: ruleTypes.CURR_USER_ACCESS,
    description() {
      return `${this.type} has to include 'edit_exercise_settings' right`;
    },
  },
  EXERCISE_EXISTS: {
    key: 'exerciseExists',
    type: [ruleTypes.EXERCISE, ruleTypes.GROUP],
    description() {
      return `${this.type[0]} has to exist within ${this.type[1]}`;
    },
  },
  CAN_CREATE_ORG: {
    key: 'canCreateOrg',
    type: ruleTypes.CURR_USER_ACCESS,
    description() {
      return `${this.type} has to include 'create_org' right`;
    },
  },
  ORG_EXISTS: {
    key: 'orgExists',
    type: ruleTypes.ORGANISATION,
    description() {
      return `${this.type} has to already exist.`;
    },
  },
  ORG_OWNER: {
    key: 'orgOwner',
    type: [ruleTypes.CURR_USER, ruleTypes.ORGANISATION],
    description() {
      return `${this.type[0]} has to be a creator (owner) of ${this.type[1]}.`;
    },
  },
  TAG_OWNER: {
    key: 'tagOwner',
    type: [ruleTypes.CURR_USER, ruleTypes.TAG],
    description() {
      return `${this.type[0]} has to be a creator of ${this.type[1]}.`;
    },
  },
};

const complexRules = {
  ADMIN_OR_FACILITATOR: {
    $or: [[rules.ADMIN], [rules.FACILITATOR]],
  },
};

// ---------MUTATIONS----------

export const accountsMutations = {
  __label: 'ACCOUNTS MUTATIONS',

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

export const groupMutations = {
  __label: 'GROUP MUTATIONS',
  __commonRules: [
    rules.LOGGED_IN,
    complexRules.ADMIN_OR_FACILITATOR,
    rules.GROUP_EXISTS,
    rules.GROUP_OWNER,
  ],

  createGroup: { rules: [] },
  setTeamGoal: { rules: [] },
  updateGroupAccess: { rules: [] },
  updateGroupIsTemplate: {
    rules: [], // FIX: has to be admin only
    comments: ['Has to be admin only?']
  },
  updateGroupMultiModulesAccess: { rules: [] },
  updateGroupName: { rules: [] },
  updateGroupPreReflectionState: { rules: [] },
};

const sessionMutations = {
  __label: 'SESSION MUTATIONS',
  __commonRules: [
    rules.LOGGED_IN,
    complexRules.ADMIN_OR_FACILITATOR,
    rules.GROUP_EXISTS,
    rules.GROUP_OWNER,
  ],
  __commonComments: [
    'Should we check meeting existence?'
  ],

  addGroupSession: { rules: [] },
  removeGroupSession: { rules: [] },
  updateGroupSession: { rules: [] },
  updateGroupSessionWeight: { rules: [] },
  updateMeetingNotes: { rules: [] },
};

const moduleMutations = {
  __label: 'MODULES MUTATIONS',
  __commonRules: [
    rules.LOGGED_IN,
  ],
  __commonComments: [
    'Should we check meeting existence?',
    'Should we check exercise existence?',
  ],

  addGroupSessionModules: {
    rules: [rules.GROUP_EXISTS, rules.GROUP_OWNER],
    roles: {
      $or: [
        [rules.ADMIN],
        [rules.FACILITATOR, rules.ADD_EXERCISES],
      ],
    },
  },
  removeGroupSessionModule: {
    rules: [complexRules.ADMIN_OR_FACILITATOR, rules.GROUP_EXISTS, rules.GROUP_OWNER],
  },
  stopGroupActiveModules: {
    rules: [complexRules.ADMIN_OR_FACILITATOR, rules.GROUP_EXISTS, rules.GROUP_OWNER],
  },
  updateGroupSessionModuleName: {
    rules: [complexRules.ADMIN_OR_FACILITATOR, rules.GROUP_EXISTS, rules.GROUP_OWNER],
  },
  // FIX: has to be allowed for group owner only. No group existence check
  updateGroupSessionModuleSettings: {
    rules: [{ $or: [[rules.ADMIN], [rules.FACILITATOR, rules.EDIT_EXERCISE_SETTINGS]] }],
    comments: [
      'Has to be allowed for group owner only!',
      'Group existence should be checked here too!',
    ],
  },
  updateGroupSessionModuleState: {
    rules: [complexRules.ADMIN_OR_FACILITATOR, rules.GROUP_EXISTS, rules.GROUP_OWNER],
  },
  updateGroupSessionModuleWeight: {
    rules: [complexRules.ADMIN_OR_FACILITATOR, rules.GROUP_EXISTS, rules.GROUP_OWNER],
  },
};

const groupTagMutations = {
  __label: 'GROUP TAG MUTATIONS',
  __commonRules: [
    rules.LOGGED_IN,
    complexRules.ADMIN_OR_FACILITATOR,
    rules.GROUP_EXISTS,
    rules.GROUP_OWNER,
  ],

  addTagToGroup: {
    rules: [],
  },
  removeGroupTag: {
    rules: [],
  },
};

const groupMembersMutations = {
  __label: 'GROUP MEMBERS MUTATIONS',
  __commonRules: [
    rules.LOGGED_IN,
    rules.GROUP_EXISTS,
  ],

  addGroupUser: {
    rules: [rules.USER_EXISTS, { $or: [rules.ME, rules.GROUP_OWNER, roles.ADMIN] }],
  },
  removeGroupUser: {
    rules: [rules.USER_EXISTS, complexRules.ADMIN_OR_FACILITATOR, rules.GROUP_OWNER],
  },
};

const groupMembersDataMutations = {
  __label: 'GROUP MEMBERS DATA MUTATIONS',
  removeAllDemonstrationsInGroupModule: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  removeAllPositiveExamplesInGroupModule: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  removeAllReflectionsInGroupModule: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  removeAllUserValuesInGroup: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  removeAllVotesInGroupModule: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  removeFocusValuesInGroup: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  updateGroupModuleCompletedByUser: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, { $or: [rules.GROUP_MEMBER, rules.GROUP_OWNER] }, rules.EXERCISE_EXISTS],
  },
  updateGroupOwnOpenAnswersVote: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      'own answer exists',
    ],
  },
  updateGroupPositiveExamplesVote: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      'positive example exists',
    ],
  },
  updateGroupSpecifyingBehaviorsVote: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      'demonstration exists',
    ],
  },
  updateUserReflectionChoice: {
    rules: [
      rules.LOGGED_IN,
      rules.USER_EXISTS,
      { $or: [rules.ME, rules.ADMIN] },
      'demonstration exists',
    ],
  },
};

const groupPresentationMutations = {
  __label: 'GROUP PRESENTATION MUTATIONS',
  startPresentation: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  stopPresentation: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  switchMeetingPresentation: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
  togglePauseOnPresentation: {
    rules: [
      rules.LOGGED_IN,
      complexRules.ADMIN_OR_FACILITATOR,
      rules.GROUP_EXISTS,
      rules.GROUP_OWNER,
    ],
  },
};

const userMutations = {
  __label: 'USER MUTATIONS',
  changeUserEmail: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
  },
  hideUserCongratulationMessage: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
  },
  removeUser: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
    comment: [
      'Should we give ability to remove MYSELF?',
    ],
  },
  userEnteredModule: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS, rules.EXERCISE_EXISTS],
  },
};

const userRolesMutations = {
  __label: 'USER ROLES MUTATIONS',
  addUserRole: {
    rules: [rules.LOGGED_IN, rules.ADMIN, rules.USER_EXISTS],
  },
  removeUserRole: {
    rules: [rules.LOGGED_IN, rules.ADMIN, rules.USER_EXISTS],
    comments: ['It can\'t remove \'admin\' role from default admins'],
  },
};

const userDataMutations = {
  __label: 'USER DATA MUTATIONS',
  updateUserActiveGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
  },
  updateUserFocusValue: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
  },
  updateUserFocusValues: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
  },
  updateUserValues: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, 'values arg can\t be empty and have more then 18 elements'],
  },
  updateUserDemonstrations: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  addUserDemonstrations: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS, 'example arg has to exist'],
  },
  updateUserPositiveExamples: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  addUserPositiveExample: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS, 'example arg has to exist'],
  },
  updateUserVotes: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS, 'choice arg has to exist'],
  },
  updateUserOwnQuestions: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  updateUserOwnQuestionWeight: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  updateUserOwnAnswers: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  updateUserStrengths: {
    rules: [rules.LOGGED_IN, rules.ME, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  removeUserFocusValuesInGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  removeUserValuesInGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  removeUserDemonstrationsInGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  removeUserPositiveExamplesInGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  removeUserReflectionsInGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  removeUserVotesInGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  updateLastViewedGroup: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  updateCurrentSelectedGroup: {
    rules: [rules.LOGGED_IN, rules.ME, rules.USER_EXISTS, rules.GROUP_EXISTS, { $or: [rules.GROUP_OWNER, rules.GROUP_MEMBER] }],
  },
  removeUserOwnQuestion: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, complexRules.ADMIN_OR_FACILITATOR] }, rules.USER_EXISTS, rules.GROUP_EXISTS],
  },
  updateModuleUserInputs: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }, rules.USER_EXISTS],
  },
};

const cardMutations = {
  __label: 'CARDS (MOTIVATIONAL FACTORS, DEV AREA, TOP PRIORITIES) MUTATIONS',
  updateCard: {
    rules: [rules.LOGGED_IN],
  },
  deleteCard: {
    rules: [rules.LOGGED_IN, 'card has to exist', 'card has to be editable by current user'],
  },
};

const organisationMutations = {
  __label: 'ORGANISATION MUTATIONS',
  createOrganisation: {
    rules: [rules.LOGGED_IN, { $or: [rules.ADMIN, rules.CAN_CREATE_ORG] }],
    comments: [
      'It would be nice to check if user is facilitator in case if he is not an admin',
    ],
  },
  editOrganisation: {
    rules: [rules.LOGGED_IN, rules.ORG_EXISTS, rules.ORG_OWNER, complexRules.ADMIN_OR_FACILITATOR],
  },
};

const tagsMutations = {
  __label: 'TAGS MUTATIONS',
  addGroupTag: {
    rules: [rules.LOGGED_IN, rules.GROUP_EXISTS, rules.GROUP_OWNER, complexRules.ADMIN_OR_FACILITATOR],
  },
  updateTag: {
    rules: [rules.LOGGED_IN, rules.TAG_OWNER, complexRules.ADMIN_OR_FACILITATOR],
  },
  deleteTag: {
    rules: [rules.LOGGED_IN, rules.TAG_OWNER, complexRules.ADMIN_OR_FACILITATOR],
  },
};

// ---------MUTATIONS END----------

// ---------QUERIES----------

const groupsQueries = {
  __label: 'GROUPS QUERIES',
  groupForUnauthorised: {
    rules: ['has to have one of arguments (groupId or code)'],
  },
  group: {
    rules: [rules.LOGGED_IN, 'has to have one of arguments (groupId or code)'],
    comments: [
      'Should we check role and ownership of current user here?',
      'Should we specify which info is accessible by whom?',
    ],
  },
  groups: {
    rules: [rules.LOGGED_IN, complexRules.ADMIN_OR_FACILITATOR],
    comments: [
      'Here user will get different data depending on his access rights. E.g. if he tries to get groups from SL template library, then it depends on whether he has \'sl template library access right\''
    ],
  },
};

const organisationsQueries = {
  __label: 'ORGANISATIONS QUERIES',
  organisation: {
    rules: [rules.LOGGED_IN, complexRules.ADMIN_OR_FACILITATOR],
  },
  organisations: {
    rules: [rules.LOGGED_IN, complexRules.ADMIN_OR_FACILITATOR],
    comments: [
      'Here user will get different data depending on his role and access rights',
      'Should we check ownership of current user and specify who has access to what?',
    ],
  },
};

const cardsQueries = {
  __label: 'CARDS (MOTIVATIONAL FACTORS, DEV AREA, TOP PRIORITIES) QUERIES',
  card: false,
  cards: false, // deprecated
};

const valueCategoriesQueries = {
  __label: 'VALUE CATEGORIES QUERIES',
  categories: false,
};

const valuesQueries = {
  __label: 'VALUES QUERIES',
  values: false,
};

const meetingsQueries = {
  __label: 'MEETINGS (SESSIONS) QUERIES',
  meeting: false,
  meetings: false,
};

const exercisesQueries = {
  __label: 'EXERCISES (GROUP MODULES) QUERIES',
  activeExercise: false,
  exercise: false,
  exercises: false,
};

const modulesQueries = {
  __label: 'MODULES QUERIES',
  modules: false,
};

const ownQuestionsQueries = {
  __label: 'OWN QUESTIONS QUERIES',
  ownQuestions: false,
};

const presentationsQueries = {
  __label: 'PRESENTATIONS QUERIES',
  presentations: false,
  currentPresentation: false,
};

const strengthsQueries = {
  __label: 'STRENGTHS QUERIES',
  strengths: false,
};

const tagsQueries = {
  __label: 'TAGS QUERIES',
  tag: false,
  tags: false,
};

const usersQueries = {
  __label: 'USERS QUERIES',
  loggedInUserId: {
    rules: [rules.LOGGED_IN],
  },
  user: {
    rules: [rules.LOGGED_IN, { $or: [rules.ME, rules.ADMIN] }],
  },
  users: {
    rules: [rules.LOGGED_IN, { $or: [complexRules.ADMIN_OR_FACILITATOR, 'users argument has to be not empty'] }],
    comments: [
      'Facilitator has only access to members of groups created by him',
      'Think about better security checks for non admin/facilitators',
    ],
  },
  usersCount: {
    rules: [rules.LOGGED_IN, complexRules.ADMIN_OR_FACILITATOR],
    comments: [
      'Facilitator has only access to members of groups created by him',
    ],
  },
  groupMembersCount: {
    rules: [],
    comments: [
      'We don\'t have any security checks here. So if anyone has groupId he can get group members count.',
    ],
  },
  orgMembersCount: {
    rules: [rules.LOGGED_IN],
    comments: [
      'Facilitator has only access to members of groups created by him',
      'Regular user can get org members count. He needs only orgId for that',
    ],
  },
  me: {
    deprecated: true,
    rules: [rules.LOGGED_IN],
  },
};

const usersDataQueries = {
  __label: 'USERS DATA QUERIES (DEPRECATED)',
  positiveExamples: {
    deprecated: true,
    rules: [rules.LOGGED_IN, rules.ADMIN],
  },
  specifyingBehaviors: {
    deprecated: true,
    rules: [rules.LOGGED_IN, rules.ADMIN],
  },
  ratingImportanceAndActing: {
    deprecated: true,
    rules: [rules.LOGGED_IN, rules.ADMIN],
  },
};

const languagesQueries = {
  __label: 'LANGUAGES QUERIES',
  languages: { rules: [] },
};

// ---------QUERIES END----------

export const allOperations = {
  accountsMutations,
  groupMutations,
  sessionMutations,
  moduleMutations,
  groupTagMutations,
  groupMembersMutations,
  groupMembersDataMutations,
  groupPresentationMutations,
  userMutations,
  userRolesMutations,
  userDataMutations,
  cardMutations,
  organisationMutations,
  tagsMutations,

  groupsQueries,
  organisationsQueries,
  // cardsQueries,
  // valueCategoriesQueries,
  // valuesQueries,
  // meetingsQueries,
  // exercisesQueries,
  // modulesQueries,
  // ownQuestionsQueries,
  // presentationsQueries,
  // strengthsQueries,
  // tagsQueries,
  usersQueries,
  usersDataQueries,
  languagesQueries,
};
