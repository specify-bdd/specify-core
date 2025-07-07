import { Rule } from "eslint";

import {
    isMultiLineNode,
    hasEmptyLineBetween,
} from "../lib/utils";

import { log } from "console";

type NodeGroup = {
    values: Rule.Node[];
    targetValueStartingPosition: number;
};

export default {
    "meta": {
        "type": "layout",
        "docs": {
            "description": "Enforce consistent alignment of object properties",
            "category":    "Stylistic Issues",
        },
        "fixable":  "whitespace",
        "schema":   [],
        "messages": {
            "misalignedProperty":
                "Object properties should be aligned with adjacent properties",
        },
    },

    create(context: Rule.RuleContext): Rule.RuleListener {
        function getValueGroups(values: Rule.Node[]): NodeGroup[] {
            const groups: Rule.Node[][] = [];

            let currentGroup: Rule.Node[] = [];

            for (let i = 0; i < values.length; i++) {
                const current  = values[i];
                const previous = values[i - 1];

                // start new group if there's a gap or it's the first property
                if (!previous || hasEmptyLineBetween(previous, current) || isMultiLineNode(previous)) {
                    if (currentGroup.length > 0) {
                        groups.push(currentGroup);
                    }

                    currentGroup = [current];
                } else {
                    currentGroup.push(current);
                }
            }

            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }

            return groups.map((group) => {
                return {
                    "values":                      group,
                    "targetValueStartingPosition": targetValueStartingPosition(group),
                };
            });
        }

        function targetValueStartingPosition(group: Rule.Node[]) {
            let targetValueStartingPosition = 0;

            group.forEach((node) => {
                if (!node.loc || !node.loc.start) {
                    return null;
                }

                const startPosition = node.loc.start.column;

                targetValueStartingPosition = Math.max(
                    targetValueStartingPosition,
                    startPosition
                );
            });

            return targetValueStartingPosition;
        }

        return {
            "ObjectPattern": (node) => {
                log(node);
            },

            "ObjectExpression": (node) => {
                if (!node.properties || node.properties.length === 0) {
                    return;
                }

                const values = node.properties.filter(
                    (prop) => prop.type === "Property"
                ).map((property) => property.value) as Rule.Node[];

                const valueGroups = getValueGroups(values);

                if (valueGroups.length === 0) {
                    return;
                }
                
                valueGroups.forEach((group) => {
                    if (group.values.length < 2) {
                        return;
                    }

                    const targetPosition = group.targetValueStartingPosition;

                    group.values.forEach((valueNode) => {
                        if (!("loc" in valueNode) || !valueNode.loc || !valueNode.loc.start) {
                            return;
                        }

                        const startPosition = valueNode.loc.start.column;

                        if (startPosition !== targetPosition) {
                            context.report({
                                "node":      valueNode,
                                "messageId": "misalignedProperty",
                                "fix":       (fixer) => {
                                    const padding = " ".repeat(
                                        targetPosition - startPosition
                                    );
                                    return fixer.insertTextBefore(
                                        valueNode,
                                        padding
                                    );
                                },
                            });
                        }
                    });
                });
            },
        };
    },
};