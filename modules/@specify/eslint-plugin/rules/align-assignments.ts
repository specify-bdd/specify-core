/* eslint-disable */

import { Rule } from "eslint";
import { log } from "console";

import { TSESTree } from "@typescript-eslint/utils";

log("testing eslint-plugin/rules/align-assignments.ts");

type Assignment = TSESTree.AssignmentExpression | TSESTree.VariableDeclaration

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

        function isNextNodeValidGroupMember(
            node: Assignment,
            previousNodeStartLine: number,
        ): boolean {
            return (
                node.type === "VariableDeclaration" &&
                node.declarations.length === 1 &&
                node.declarations[0].init &&
                node.loc.start.line === previousNodeStartLine + 1
            );
        }

        function isPreviousNodeValidGroupMember(
            node: Assignment,
            nextNodeStartLine: number,
        ): boolean {
            return (
                node.type === "VariableDeclaration" &&
                node.declarations.length === 1 &&
                node.declarations[0].init &&
                node.loc.start.line === nextNodeStartLine - 1
            );
        }

        function isAdjustableVariableDeclaration(
            node: Assignment,
        ): boolean {
            return (
                node.type === "VariableDeclaration" &&
                node.declarations.length === 1 &&
                node.declarations[0].init &&
                node.declarations[0].id.type === "Identifier" &&
                !processedNodes.has(node)
            );
        }

        function getAssignmentGroup(
            startNode: Assignment,
            nodeType: "VariableDeclaration" | "AssignmentExpression",
        ): Assignment[] {
            const parentBody = (startNode.parent as any).body;
            const group = [startNode] as Assignment[];

            if (startNode.loc.start.line !== startNode.loc.end.line || !parentBody?.indexOf) {
                return group;
            }

            const getAdjacentNodes = (direction: "next" | "previous"): Assignment[] => {
                const offset = direction === "next" ? 1 : -1;
                const nodes: Assignment[] = [];

                let adjacentNode = parentBody[parentBody.indexOf(startNode) + offset];
                let adjacentNodeStartLine = startNode.loc.start.line;

                while (adjacentNode && isNextNodeValidGroupMember(adjacentNode, adjacentNodeStartLine)) {
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

        return {
            AssignmentExpression(currentNode) {
                // code goes here
            },

            VariableDeclaration(currentNode) {
                const node = currentNode as TSESTree.VariableDeclaration; // re-cast for clarity
                const variableGroup = getAssignmentGroup(node, "VariableDeclaration");

                if (!isAdjustableVariableDeclaration(node)) {
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
