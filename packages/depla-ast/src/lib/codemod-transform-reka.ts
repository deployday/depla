import * as recast from 'recast';
import { default as j } from 'jscodeshift';

export default function transform(source) {
  const ast = recast.parse(source);
  const response = {
    components: [],
    variables: [],
    source,
  };

  const expressionToReka = (expression, path) => {
    let expr, ifCondition;
    if (j.CallExpression.check(expression)) {
      expr = expression;
    } else if (j.LogicalExpression.check(expression)) {
      ifCondition = expression.left;
      expr = expression.right;
    } else if (j.ConditionalExpression.check(expression)) {
      ifCondition = expression.test;
      expr = expression.consequent;
    }
    if (typeof expr === 'undefined') return;

    const { errors: extractErrors, element: consequentElement } =
      extractElement(expr);
    if (extractErrors.length) {
      j(path).remove();
      return;
    }

    if (ifCondition) {
      const ifAttr = j.jsxAttribute(
        j.jsxIdentifier('@if'),
        j.jsxExpressionContainer(ifCondition)
      );
      consequentElement.openingElement.attributes.push(ifAttr);
    }

    j(path).replaceWith(consequentElement);
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

    const iterator = item.callee.object.name;
    const aliasItem = item.arguments[0].params[0];

    if (!j.Identifier.check(aliasItem)) {
      response.errors.push({ message: `removed ${iterator}.map()` });
      response.element = element;
      return response;
    }
    const alias = j.identifier(aliasItem.name);

    const value = j.binaryExpression('in', alias, j.identifier(iterator));

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

    console.log('UUUU', variables, path);
    return [...new Set(variables)];
  };

  const result = j(ast)
    .find(j.Node)
    .forEach((path) => {
      response.variables = [
        ...new Set([...response.variables, ...extractVariables(path)]),
      ];

      if (j.JSXNamespacedName.check(path.node)) {
        // strip astro attributes like set:html=""
        j(path.parentPath).remove();
        return;
      }

      if (j.JSXElement.check(path.node)) {
        const elementName = path.node.openingElement.name.name;
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
          const str = path.node.value.replace(/[\n\s]/g, '');
          if (str) {
            const [before, after] = path.node.value.split(str);
            if (before) path.insertBefore(j.jsxText(before));
            if (after) path.insertAfter(j.jsxText(after));
            value = j.literal(str);
          }
        } else if (
          j.JSXExpressionContainer.check(path.node) &&
          j.JSXElement.check(path.parentPath.node)
        ) {
          if (j.Literal.check(path.node.expression)) {
            const str = path.node.expression.value.replace(/[\n\s]/g, '');
            if (str) value = j.literal(str);
          }
          if (j.Identifier.check(path.node.expression)) {
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
