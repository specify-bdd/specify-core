Feature: Multi-type parameter expressions
    As a developer writing step definitions
    I want to use pipe-delimited types in parameter syntax
    So that a single pattern can match multiple Cucumber parameter types

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed

    Rule: A step definition accepts any of its pipe-delimited parameter types

        Scenario Outline: Step matches each of its declared types
            When the user stores the value <input>
            Then the stored value's type should be "<type>"

            Examples:
                | input   | type   |
                | 42      | number |
                | "hello" | string |

    Rule: Pipe-delimited types work inside enhanced bracket notation

        Scenario Outline: Step with bracket notation matches each of its declared types
            When I store the value <input>
            Then the stored value's type should be "<type>"

            Examples:
                | input   | type   |
                | 42      | number |
                | "hello" | string |
