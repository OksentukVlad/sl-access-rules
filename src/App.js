import React from 'react';
import './App.css';

import { allOperations } from './access-rules';

const isString = val => (typeof val === 'string') || (val instanceof String);

const resolveRules = (rules = []) => {
  if (!rules.length) {
    return {
      rules,
      variable: false,
    };
  }

  const r = rules.reduce(({ withOr, withoutOr }, rule) => {
    if (isString(rule)) {
      return {
        withOr,
        withoutOr: [...withoutOr, { key: rule, mark: true, description: () => rule }],
      };
    }

    if (rule.$or) {
      return {
        withOr: withOr.concat(rule),
        withoutOr,
      };
    }

    return {
      withOr,
      withoutOr: withoutOr.concat(rule),
    };
  }, {
    withOr: [],
    withoutOr: [],
  });

  if (!r.withOr.length) {
    return {
      rules,
      variable: false,
    };
  }

  let resultRules = [];

  r.withOr.forEach(({ $or }) => {
    const orRules = $or
      .map(orRule => Array.isArray(orRule) ? resolveRules(orRule).rules : [orRule]);

    if (!resultRules.length) {
      resultRules = orRules;
      return;
    }

    resultRules = resultRules.reduce((acc, resRule) => [
      ...acc,
      ...orRules.reduce((acc2, orRule) => [...acc2, [...resRule, ...orRule]], []),
    ], []);
  });

  const result = {
    variable: true,
    rules: resultRules.map(res => [...res, ...r.withoutOr]),
  };

  return result;
};

const getRuleDescription = rule => (rule.description ? rule.description() : '');

const reduceRules = (rules = []) => {
  const rulesKeyCounter = rules.reduce((acc, rule) => {
    if (acc[rule.key]) {
      return acc;
    }

    return {
      ...acc,
      [rule.key]: rule,
    };
  }, {});

  return Object.keys(rulesKeyCounter)
    .map(key => rulesKeyCounter[key]);
};

const renderR = (rules) => {
  return reduceRules(rules)
    .filter(rule => !!getRuleDescription(rule))
    .map(rule => <p key={rule.key} style={rule.mark ? { color: 'red' } : {}}>{getRuleDescription(rule)}</p>);
};

const renderRules = (r) => {
  const { rules, variable } = resolveRules(r);

  if (!variable) {
    return renderR(rules);
  }

  if (!rules.length || rules.length === 1) {
    return renderR(rules);
  }

  const rulesCounter = rules.reduce((acc, rs = []) => {
    const listKey = rs
      .map(rule => rule.key)
      .sort((a, b) => a.localeCompare(b))
      .join('-');

    if (acc[listKey]) {
      return acc;
    }

    return {
      ...acc,
      [listKey]: rs,
    };
  }, {});

  return Object.keys(rulesCounter)
    .map(key => rulesCounter[key])
    .reduce((acc, rs) => {
      if (!acc.length) {
        return [renderR(rs)];
      }

      return [...acc, <p key={`OR-${acc.length}`}>OR</p>, renderR(rs)];
    }, []);
};

const renderRows = (a, commonRules = [], commonComments = []) => {
  return Object.keys(a).map(name => (
    <tr key={name}>
      <td>{name}</td>
      <td></td>
      <td>
        {renderRules([...commonRules, ...(a[name].rules || [])])}
      </td>
      <td>
        {
          [...commonComments, ...(a[name].comments || [])]
            .map(comment => (
              <p key={comment}>{comment}</p>
            ))
        }
      </td>
    </tr>
  ));
};

const renderRulesTable = ({
  __label = '',
  __commonRules = [],
  __commonComments,
  ...operations,
}, key) => {
  return (
    <table key={key}>
      <caption>{__label}</caption>
      <thead>
      <tr>
        <th>Operation Name</th>
        <th>Operation Description</th>
        <th>Rules</th>
        <th>Proposed changes and comments</th>
      </tr>
      </thead>
      <tbody>
      {renderRows(operations, __commonRules, __commonComments)}
      </tbody>
    </table>
  );
};

function App() {
  return (
    <div className="main">
      {
        Object.keys(allOperations)
          .map(key => renderRulesTable(allOperations[key], key))
      }
    </div>
  );
}

export default App;
