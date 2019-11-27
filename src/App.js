import React, { useState } from 'react';
import './App.css';

import { allOperations } from './access-rules';
import useLocalStorage from './useLocalStorage';

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

const renderRows = (a, commonRules = [], commonComments = [], highlight) => {
  return Object.keys(a).map(name => (
    <tr key={name} className={a[name].classes}>
      <td>{name}</td>
      <td>{a[name].deprecated ? 'Deprecated' : ''}</td>
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
      <td>
        <button onClick={() => highlight(name)}>Highlight</button>
      </td>
    </tr>
  ));
};

const renderRulesTable = ({
  __label = '',
  __commonRules = [],
  __commonComments,
  ...operations
}, key, highlight) => {
  return (
    <table key={key}>
      <caption className="table-title">{__label}</caption>
      <thead>
      <tr>
        <th>Operation Name</th>
        <th>Operation Description</th>
        <th>Rules</th>
        <th>Proposed changes and comments</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {renderRows(operations, __commonRules, __commonComments, name => highlight(`${key}.${name}`))}
      </tbody>
    </table>
  );
};

function App() {
  const allOperationsKeys = Object.keys(allOperations);
  const [currentTableKey, changeTableKey] = useState(allOperationsKeys[0]);
  const [highlightedMap, updateHighlightedMap] = useLocalStorage('highlighted', {});
  const [commentsMap, updateCommentsMap] = useLocalStorage('comments', {});
  const showHighlightedKey = 'HIGHLIGHTED';
  const commentedKey = 'COMMENTED';

  const toggleHighlight = key => {
    const { [key]: currKeyValue, ...rest } = highlightedMap;

    if (currKeyValue) {
      updateHighlightedMap(rest);
    } else {
      updateHighlightedMap({
        ...rest,
        [key]: true,
      });
    }
  };

  if (showHighlightedKey !== currentTableKey && commentedKey !== currentTableKey) {
    Object.keys(allOperations[currentTableKey]).forEach(key => {
      if (key.indexOf('__') === 0) return;

      allOperations[currentTableKey][key].classes = highlightedMap[`${currentTableKey}.${key}`] ? 'highlighted' : '';
    });
  }

  return (
    <div className="main">
      <div className="menu">
        <ul>
          <li
            className={`menu-item ${showHighlightedKey === currentTableKey ? 'active' : ''}`}
            onClick={() => changeTableKey(showHighlightedKey)}
          >
            {showHighlightedKey}
          </li>
          {/*<li*/}
          {/*  className={`menu-item ${commentedKey === currentTableKey ? 'active' : ''}`}*/}
          {/*  onClick={() => changeTableKey(commentedKey)}*/}
          {/*>*/}
          {/*  {commentedKey}*/}
          {/*</li>*/}
          {
            allOperationsKeys
              .map(key =>
                <li
                  key={key}
                  className={`menu-item ${key === currentTableKey ? 'active' : ''}`}
                  onClick={() => changeTableKey(key)}
                >
                  {key}
                </li>
              )
          }
        </ul>
      </div>
      <div className="main-content">
        {
          currentTableKey !== showHighlightedKey
            ? renderRulesTable(allOperations[currentTableKey], currentTableKey, toggleHighlight)
            : (
              <table>
                <caption className="table-title">{showHighlightedKey}</caption>
                <thead>
                <tr>
                  <th>Operation Name</th>
                  <th>Operation Description</th>
                  <th>Rules</th>
                  <th>Proposed changes and comments</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                  Object.keys(allOperations)
                    .reduce((acc, tableKey) => {
                      const {
                        __label = '',
                        __commonRules = [],
                        __commonComments = [],
                        ...operations
                      } = allOperations[tableKey];

                      const highlightedOperations = Object.keys(operations).reduce((hAcc, oKey) => {
                        const operation = operations[oKey];
                        const cacheName = `${tableKey}.${oKey}`;

                        if (!highlightedMap[cacheName]) return hAcc;

                        return [
                          ...hAcc,
                          {
                            name: oKey,
                            cacheName,
                            ourComments: commentsMap[cacheName] || [],
                            ...operation,
                          },
                        ];
                      }, []);

                      return acc.concat(
                        highlightedOperations.map(operation => ({
                          ...operation,
                          rules: [...(__commonRules || []), ...(operation.rules || [])],
                          comments: [...(__commonComments || []), ...(operation.comments || [])],
                        }))
                      );
                    }, [])
                    .map(({ name, rules, comments, cacheName, ourComments, deprecated }) => (
                      <tr key={name} className="highlighted">
                        <td>{name}</td>
                        <td>{deprecated ? 'Deprecated' : ''}</td>
                        <td>
                          {renderRules(rules)}
                        </td>
                        <td>
                          {
                            comments
                              .map(comment => (
                                <p key={comment}>{comment}</p>
                              ))
                          }
                          {
                            ourComments
                              .map(comment => (
                                <p
                                  key={comment}
                                  style={{ color: 'green' }}
                                >
                                  {comment}
                                  <span
                                    onClick={() => {
                                      updateCommentsMap({
                                        ...commentsMap,
                                        [cacheName]: ourComments.filter(c => c !== comment),
                                      })
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >[X]</span>
                                </p>
                              ))
                          }
                          <input type="text" onKeyDown={(e) => {
                            if (e.keyCode === 13 && e.target.value && e.target.value.trim()) {
                              updateCommentsMap({
                                ...commentsMap,
                                [cacheName]: [
                                  ...ourComments,
                                  e.target.value.trim(),
                                ],
                              });
                              e.target.value = '';
                            }
                          }}/>
                        </td>
                        <td>
                          <button onClick={() => toggleHighlight(cacheName)}>Un-Highlight</button>
                        </td>
                      </tr>
                    ))
                }
                </tbody>
              </table>
            )
        }
      </div>
    </div>
  );
}

export default App;
