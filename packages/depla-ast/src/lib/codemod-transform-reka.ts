import * as recast from 'recast';
import * as parser from 'recast/parsers/babel.js';
import * as fs from 'node:fs';
import { default as j } from 'jscodeshift';

export default function transform(s) {
  // fix fragments
  const source = s.replace('<>', '<Fragment>').replace('</>', '</Fragment>');
  const ast = recast.parse(source, {
    parser,
  });
  const response = {
    components: [],
    variables: [],
    source,
  };

  const transformLogicalExpressionToTernary = (
    expression,
    consequent = null,
    operator = '||'
  ) => {
    if (!j.LogicalExpression.check(expression))
      return expression || j.jsxEmptyExpression();
    if (j.Identifier.check(expression.left)) {
      const c = consequent
        ? operator === '||'
          ? j.conditionalExpression(
              expression.right,
              expression.right,
              consequent
            )
          : j.conditionalExpression(expression.right, consequent, j.literal(''))
        : expression.right;
      if (expression.operator === '||') {
        return j.conditionalExpression(expression.left, expression.left, c);
      } else if (expression.operator === '&&') {
        return j.conditionalExpression(expression.left, c, j.literal(''));
      }
    } else if (j.UnaryExpression.check(expression.left)) {
      return expression.left;
    } else {
      return transformLogicalExpressionToTernary(
        expression.left,
        expression.right,
        expression.operator
      );
    }
  };

  const expressionToReka = (expression, path) => {
    let expr, ifCondition;
    if (j.CallExpression.check(expression)) {
      expr = expression;
    } else if (j.LogicalExpression.check(expression)) {
      ifCondition = expression.left;
      expr = expression.right;
    } else if (j.UnaryExpression.check(expression)) {
      expr = expression;
    } else if (j.ConditionalExpression.check(expression)) {
      ifCondition = expression.test;
      expr = expression.consequent;
    }
    if (typeof expr === 'undefined') return;

    const { errors: extractErrors, element: consequentElement } =
      extractElement(expr);
    if (extractErrors && extractErrors.length) {
      console.log('ERERERERERER', extractErrors);
      j(path).remove();
      return;
    }

    if (ifCondition && j.JSXElement.check(consequentElement)) {
      const ifAttr = j.jsxAttribute(
        j.jsxIdentifier('@if'),
        j.jsxExpressionContainer(
          transformLogicalExpressionToTernary(ifCondition)
        )
      );
      // if (!consequentElement.openingElement) console.log('FOOOOUNDDD', path);
      consequentElement.openingElement.attributes.push(ifAttr);
    }

    if (consequentElement) {
      j(path).replaceWith(consequentElement);
    } else {
      // that is not JSX element, so convert {foo || bar} to {foo ? foo : bar}
      const ternaryExpression = transformLogicalExpressionToTernary(
        path.node.expression
      );

      if (j.Expression.check(ternaryExpression))
        j(path).replaceWith(j.jsxExpressionContainer(ternaryExpression));
    }
  };

  const extractElement = (item) => {
    const response = {
      errors: [],
      element: null,
    };
    if (j.JSXElement.check(item)) {
      response.element = item;
      return response;
    }
    if (!j.CallExpression.check(item)) return response;
    const element = item.arguments[0].body;

    let iterator;
    if (j.MemberExpression.check(item.callee.object)) {
      iterator = item.callee.object;
    } else {
      iterator = j.identifier(item.callee.object.name);
    }
    const aliasItem = item.arguments[0].params[0];

    if (!j.Identifier.check(aliasItem)) {
      response.errors.push({ message: `removed ${iterator}.map()` });
      response.element = element;
      return response;
    }
    const alias = j.identifier(aliasItem.name);

    const value = j.binaryExpression('in', alias, iterator);

    const each = j.jsxAttribute(
      j.jsxIdentifier('@each'),
      j.jsxExpressionContainer(value)
    );
    element.openingElement.attributes.push(each);

    response.element = element;
    return response;
  };

  const extractVariables = (path) => {
    const variables = [];
    if (j.Identifier.check(path.node.expression)) {
      variables.push(path.node.expression.name);
    }
    if (j.Identifier.check(path.node.left)) {
      variables.push(path.node.left.name);
    }
    if (j.Identifier.check(path.node.right)) {
      variables.push(path.node.right.name);
    }
    if (j.MemberExpression.check(path.node.object)) {
      variables.push(path.node.object.object.name);
    }
    if (j.Identifier.check(path.node.object)) {
      // variables.push(path.node.object.name);
    }

    // console.log('UUUU', variables, path);
    return [...new Set(variables)];
  };

  const result = j(ast)
    .find(j.Node)
    .forEach((path) => {
      response.variables = [
        ...new Set([...response.variables, ...extractVariables(path)]),
      ];

      // Remove comments blocks
      if (j.JSXEmptyExpression.check(path.node)) j(path.parentPath).remove();

      if (
        j.JSXExpressionContainer.check(path.node) &&
        path.node.expression &&
        path.node.expression.extra &&
        path.node.expression.extra.raw &&
        path.node.expression.extra.raw.match(/^'[^']+'$/)
      ) {
        j(path).replaceWith(
          j.jsxExpressionContainer(j.literal(path.node.expression.value))
        );
      }

      if (
        j.JSXExpressionContainer.check(path.node) &&
        j.TemplateLiteral.check(path.node.expression)
      ) {
        const s = path.node.expression.quasis.reduce(
          (acc, txt) => (acc += txt.value.raw),
          ''
        );
        j(path).replaceWith(j.literal(s));
      }

      if (
        j.JSXAttribute.check(path.node) &&
        path.node.name &&
        path.node.name.name &&
        path.node.name.name.indexOf &&
        path.node.name.name.indexOf('-') !== -1
      ) {
        j(path).remove();
      }

      if (
        j.JSXAttribute.check(path.node) &&
        path.node.name &&
        path.node.name.name &&
        path.node.name.name.indexOf &&
        path.node.name.name.indexOf('-') !== -1
      ) {
        j(path).remove();
      }

      if (
        j.JSXAttribute.check(path.node) &&
        j.JSXIdentifier.check(path.node.name) &&
        j.JSXExpressionContainer.check(path.node.value) &&
        j.Literal.check(path.node.value.expression) &&
        !path.node.value.expression.value
      ) {
        j(path).replaceWith(
          j.jsxAttribute(j.jsxIdentifier(path.node.name.name), j.literal(''))
        );
      }

      // replace class:list={[]} with @classList={{}} attribute
      if (
        j.JSXAttribute.check(path.node) &&
        j.JSXNamespacedName.check(path.node.name) &&
        path.node.name.namespace?.name === 'class' &&
        path.node.name.name.name === 'list'
      ) {
        const tmp = [];
        path.node.value.expression.elements.forEach((el) => {
          if (j.ObjectExpression.check(el)) {
            el.properties.forEach((prop) => {
              if (
                j.Identifier.check(prop.value) ||
                j.Literal.check(prop.value) ||
                j.BinaryExpression.check(prop.value) ||
                j.UnaryExpression.check(prop.value)
              ) {
                const className = prop.key.name || prop.key.value;
                console.log('ADDING', className, prop);
                const cond = prop.value;
                tmp.push(j.property('init', j.literal(className), cond));
              }
            });
          } else if (j.Literal.check(el)) {
            const trueClasses = el.value.split(' ').forEach((trueClass) => {
              tmp.push(
                j.property('init', j.literal(trueClass), j.literal(true))
              );
            });
          }
        });
        const classList = j.jsxAttribute(
          j.jsxIdentifier('@classList'),
          j.jsxExpressionContainer(j.objectExpression(tmp))
        );
        j(path).replaceWith(classList);
      }

      // get rid of set:html={}
      if (
        j.JSXAttribute.check(path.node) &&
        j.JSXNamespacedName.check(path.node?.name) &&
        path.node.name.namespace.name === 'set' &&
        path.node.name.name.name === 'html'
      ) {
        j(path).remove();
      }

      if (j.JSXElement.check(path.node)) {
        const elementName = path.node.openingElement.name.name;
        // if (!elementName)
        //   fs.writeFileSync('/tmp/file', JSON.stringify(path.node, null, 2));

        const isComponent =
          elementName.charAt(0) === elementName.charAt(0).toUpperCase();
        if (isComponent) response.components.push(elementName);
      }

      if (
        j.JSXExpressionContainer.check(path.node) &&
        (j.CallExpression.check(path.node.expression) ||
          j.LogicalExpression.check(path.node.expression) ||
          j.ConditionalExpression.check(path.node.expression))
      ) {
        expressionToReka(path.node.expression, path);
      } else {
        let value;
        if (j.JSXText.check(path.node)) {
          const trimmedValue = path.node.value.trim().replaceAll(/\r\n/g, '');
          if (trimmedValue !== path.node.value) {
            const str = path.node.value;
            if (trimmedValue) {
              value = j.literal(trimmedValue);
              const p = j.jsxFragment(
                j.jsxOpeningFragment(),
                j.jsxClosingFragment()
              );

              const [before, after] = str.split(str.trim());
              if (before) {
                p.children.push(
                  j.jsxElement(
                    j.jsxOpeningElement(
                      j.jsxIdentifier('text'),
                      [
                        j.jsxAttribute(
                          j.jsxIdentifier('value'),
                          j.jsxText(before)
                        ),
                      ],
                      true
                    )
                  )
                );
              }
              p.children.push(
                j.jsxElement(
                  j.jsxOpeningElement(
                    j.jsxIdentifier('text'),
                    [j.jsxAttribute(j.jsxIdentifier('value'), value)],
                    true
                  )
                )
              );
              if (after) {
                p.children.push(
                  j.jsxElement(
                    j.jsxOpeningElement(
                      j.jsxIdentifier('text'),
                      [
                        j.jsxAttribute(
                          j.jsxIdentifier('value'),
                          j.jsxText(after)
                        ),
                      ],
                      true
                    )
                  )
                );
              }
              j(path).replaceWith(p);
            }
          } else {
            value = j.literal(trimmedValue);
          }
        } else if (
          j.JSXExpressionContainer.check(path.node) &&
          j.JSXElement.check(path.parentPath.node)
        ) {
          if (j.Literal.check(path.node.expression)) {
            const str = path.node.expression.value.trim();
            if (str) value = j.literal(str);
          }
          if (
            j.Identifier.check(path.node.expression) ||
            j.MemberExpression.check(path.node.expression)
          ) {
            value = j.jsxExpressionContainer(path.node.expression);
          }
        }
        if (typeof value !== 'undefined') {
          const el = j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier('text'),
              [j.jsxAttribute(j.jsxIdentifier('value'), value)],
              true
            )
          );
          j(path).replaceWith(el);
        }
      }
    });
  response.source = result.toSource().trim();

  return response;
}
