/* eslint-disable */

import { Rule } from "eslint";
import { TSESTree } from "@typescript-eslint/utils";

type Assignment =
    TSESTree.AssignmentExpression |
    TSESTree.ExpressionStatement |
    TSESTree.VariableDeclaration

export default {
    "meta": {
        "name": "align-assignments",
        "type": "problem",
        "fixable": "whitespace",
        "docs": {
            "description":
                "Assignment operators should be aligned in adjacent declarations",
            "category": "Stylistic Issues",
        },
        "priority": 1,
    },
    create(context: Rule.RuleContext): Rule.RuleListener {
        const processedNodes = new Set<Assignment>();

        function getAssignmentGroup(
            startNode: Assignment,
            nodeType: "VariableDeclaration" | "AssignmentExpression",
        ): Assignment[] {
            const group = [startNode] as Assignment[];
            const parentBody = (nodeType === "VariableDeclaration") ? 
                (startNode.parent as any).body :
                (startNode.parent?.parent as any).body; // assignment expressions have expression statements as parents

            if (startNode.loc.start.line !== startNode.loc.end.line || !parentBody?.indexOf) {
                return group;
            }

            const isAdjacentNodeValidGroupMember = (
                node: Assignment,
                adjacentNodeStartLine: number,
                offset: number,
            ): boolean => {
                if (node.type === "VariableDeclaration") {
                    return (
                        node.declarations.length === 1 &&
                        node.declarations[0].init &&
                        node.loc.start.line === adjacentNodeStartLine + offset
                    );
                } else if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression") {
                    log(node.expression.left.type, node.loc.start.line, adjacentNodeStartLine + offset);
                    return (
                        node.expression.left.type === "Identifier" &&
                        node.loc.start.line === adjacentNodeStartLine + offset
                    );
                }

                return false;
            }

            const getAdjacentNodes = (direction: "next" | "previous"): Assignment[] => {
                const offset = direction === "next" ? 1 : -1;
                const nodes: Assignment[] = [];

                let adjacentNode = parentBody[parentBody.indexOf(startNode) + offset];
                let adjacentNodeStartLine = startNode.loc.start.line;

                while (adjacentNode && isAdjacentNodeValidGroupMember(adjacentNode, adjacentNodeStartLine, offset)) {
                    if (adjacentNode.type !== nodeType) {
                        break; // stop if the next node is not of the expected type
                    }

                    if (direction === "next") {
                        nodes.push(adjacentNode);
                    } else {
                        nodes.unshift(adjacentNode);
                    }

                    adjacentNodeStartLine = adjacentNode.loc.start.line;
                    adjacentNode = parentBody[parentBody.indexOf(adjacentNode) + offset];
                }

                return nodes;
            };

            // collect adjacent nodes in both directions
            group.push(...getAdjacentNodes("next"));
            group.unshift(...getAdjacentNodes("previous"));

            return Array.from(new Set(group));
        }

        function getIdentifierEndColumn(node: Assignment): number {
            if (node.type === "VariableDeclaration") {
                return node.declarations[0].id.loc.end.column;
            } else if (node.type === "AssignmentExpression") {
                return node.left.loc.end.column;
            }
            return 0;
        }

        function getAssignmentOperatorToken(node: Assignment): any {
            if (node.type === "VariableDeclaration") {
                const declarator = node.declarations[0];

                if (!declarator.id || declarator.id.type !== "Identifier") {
                    return null;
                }

                return context.sourceCode.getTokenAfter(declarator.id, {
                    filter: (token) => token.value === "=",
                });
            } else if (node.type === "AssignmentExpression") {
                if (node.left.type !== "Identifier") {
                    return null;
                }

                return context.sourceCode.getTokenAfter(node.left, {
                    filter: (token) => token.value === "=",
                });
            }

            return null;
        }

        return {
            AssignmentExpression(currentNode) {
                const node = currentNode as TSESTree.AssignmentExpression;
                const assignmentGroup =
                    getAssignmentGroup(node, "AssignmentExpression") as TSESTree.AssignmentExpression[];

                const isAdjustable = (node: Assignment): boolean => {
                    return (
                        node.type === "AssignmentExpression" &&
                        node.left.type === "Identifier" &&
                        node.operator === "=" &&
                        !processedNodes.has(node)
                    );
                };

                if (!isAdjustable(node)) {
                    return;
                }

                assignmentGroup.forEach((groupNode) => processedNodes.add(groupNode));

                const maxIdentifierColumn = Math.max(...assignmentGroup.map(getIdentifierEndColumn));

                for (const groupNode of assignmentGroup) {
                    const equalToken = getAssignmentOperatorToken(groupNode);

                    if (!equalToken) {
                        continue;
                    }

                    const identifierEndColumn = getIdentifierEndColumn(groupNode);
                    const expectedSpaces = maxIdentifierColumn - identifierEndColumn + 1;
                    const actualSpaces = equalToken.loc.start.column - identifierEndColumn;

                    if (actualSpaces !== expectedSpaces) {
                        context.report({
                            "node": groupNode as any,
                            "message": "Assignment operators should be aligned in adjacent assignments",

                            fix(fixer) {
                                const spaceBefore = context.sourceCode.getTokenBefore(equalToken);

                                return fixer.replaceTextRange(
                                    [spaceBefore.range[1], equalToken.range[0]],
                                    " ".repeat(expectedSpaces),
                                );
                            },
                        });
                    }
                }
            },

            VariableDeclaration(currentNode) {
                const node = currentNode as TSESTree.VariableDeclaration; // re-cast for clarity
                const variableGroup = getAssignmentGroup(node, "VariableDeclaration") as TSESTree.VariableDeclaration[];

                const isAdjustable = (node: Assignment): boolean => {
                    return (
                        node.type === "VariableDeclaration" &&
                        node.declarations.length === 1 &&
                        node.declarations[0].init &&
                        node.declarations[0].id.type === "Identifier" &&
                        !processedNodes.has(node)
                    );
                };

                if (!isAdjustable(node)) {
                    return;
                }

                variableGroup.forEach((groupNode) => processedNodes.add(groupNode));

                const maxDeclaratorColumn = Math.max(...variableGroup.map((groupNode) => {
                    const declarator = groupNode.declarations[0];

                    return declarator.id.loc.end.column;
                }));

                for (const groupNode of variableGroup) {
                    const declarator = groupNode.declarations[0];

                    if (!declarator.id || declarator.id.type !== "Identifier") {
                        continue;
                    }

                    const equalToken = context.sourceCode.getTokenAfter(declarator.id, {
                        filter: (token) => token.value === "=",
                    });

                    if (!equalToken) {
                        continue;
                    }

                    const declaratorEndColumn = declarator.id.loc.end.column;
                    const expectedSpaces = maxDeclaratorColumn - declaratorEndColumn + 1;
                    const actualSpaces = equalToken.loc.start.column - declaratorEndColumn;

                    if (actualSpaces !== expectedSpaces) {
                        context.report({
                            "node": groupNode as any,
                            "message": "Assignment operators should be aligned in adjacent declarations",

                            fix(fixer) {
                                const spaceBefore = context.sourceCode.getTokenBefore(equalToken);

                                return fixer.replaceTextRange(
                                    [spaceBefore.range[1], equalToken.range[0]],
                                    " ".repeat(expectedSpaces),
                                );
                            },
                        });
                    }
                }
            },
        };
    },
};
