import React from 'react';
import './App.css';

import { accountsMutations, groupMutations } from './access-rules';

const { __commonRules: grCommonRules, ...grMutations } = groupMutations;

const resolveRules = (rules = []) => {
  if (!rules.length) {
    return {
      rules,
      variable: false,
    };
  }

  const r = rules.reduce(({ withOr, withoutOr }, rule) => {
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

  console.log(result);

  return result;
};

const renderR = (rules) => {
  return rules
    .map(rule => (rule.description ? rule.description() : ''))
    .filter(s => !!s)
    .map(s => <p>{s}</p>);
};

const renderRules = (r) => {
  const { rules, variable } = resolveRules(r);

  if (!variable) {
    return renderR(rules);
  }

  if (!rules.length || rules.length === 1) {
    return renderR(rules);
  }

  return rules
    .reduce((acc, rs, i) => {
      if (!acc.length) {
        return [renderR(rs)];
      }

      return [...acc, <p>OR</p>, renderR(rs)];
    }, []);
};

const renderRows = (a, commonRules) => {
  return Object.keys(a).map(name => (
    <tr key={name}>
      <td>{name}</td>
      <td></td>
      <td>
        {renderRules([...commonRules, ...(a[name].rules || [])])}
      </td>
      <td></td>
    </tr>
  ));
};

function App() {
  return (
    <div className="main">
      <table>
        <caption>Account Mutations</caption>
        <thead>
          <tr>
            <th>Operation Name</th>
            <th>Operation Description</th>
            <th>Rules</th>
            <th>Proposed changes and comments</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(accountsMutations).map(name => (
              <tr key={name}>
                <td>{name}</td>
                <td></td>
                <td>
                  {
                    resolveRules(accountsMutations[name].rules || []).rules
                      .map(rule => (rule.description ? rule.description() : ''))
                      .filter(s => !!s)
                      .map(s => <p>{s}</p>)
                  }
                </td>
                <td></td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <table>
        <caption>Group Mutations</caption>
        <thead>
        <tr>
          <th>Operation Name</th>
          <th>Operation Description</th>
          <th>Rules</th>
          <th>Proposed changes and comments</th>
        </tr>
        </thead>
        <tbody>
        {renderRows(grMutations, grCommonRules)}
        </tbody>
      </table>
    </div>
  );
}

export default App;
