var lexicalAnalyzerParameter = {
    lexicals: [
        //Operand
        {
            string: "p",
            token: 1
        },
        {
            string: "q",
            token: 1
        },
        {
            string: "r",
            token: 1
        },
        {
            string: "s",
            token: 1
        },
        //Operator
        {
            string: "not",
            token: 2
        },
        {
            string: "and",
            token: 3
        },
        {
            string: "or",
            token: 4
        },
        {
            string: "xor",
            token: 5
        },
        {
            string: "if",
            token: 6
        },
        {
            string: "then",
            token: 7
        },
        {
            string: "iff",
            token: 8
        },

        //Grouping
        {
            string: "(",
            token: 9
        },
        {
            string: ")",
            token: 10
        },
    ],
    // separators: [" ", "(", ")"],
    separator: " ",
    buildDictionaryWithAutomataState: true,
    groupingSymbols: {
        start: [
            //Paranthesis
            {
                string: "(",
                token: 9,
                epsilonMoveTo: '_ROOT_'
            },
        ],
        end: [
            //Paranthesis
            {
                string: ")",
                token: 10,
                epsilonMoveTo: '_ROOT_'
            },
        ]
    }
}

var pushdownParameter = {
    states: [
        //Formula
        {
            terminal: "S",
            grammar: [
                {
                    symbols: ["P", "M"], //P AND Q
                    lookaheadSymbols: ["1", "9"]
                },
                {
                    symbols: ["6", "P", "7", "P"], //IF P THEN Q
                    lookaheadSymbols: ["6"]
                },
                {
                    symbols: ["2", "P"], // (negation P)
                    lookaheadSymbols: ["2"]
                }
            ],
            isRoot: true
        },
        //Propotition
        {
            terminal: "P",
            grammar: [
                {
                    symbols: ["9", "S", "10"], // (formula)
                    lookaheadSymbols: ["9"]
                },
                {
                    symbols: ["1"], // (P),
                    lookaheadSymbols: ["1"]
                }
            ]
        },
        //Operand
        {
            terminal: "M",
            grammar:[
                {
                    symbols: ["O", "P"],
                    lookaheadSymbols: ["3","4","5","8"]
                },
                {
                    symbols: [""], // epsilon
                    lookaheadSymbols: [""]
                }
            ]
        },
        //Operator
        {
            terminal: "O",
            grammar: [
                {
                    symbols: ["3"], //and
                    lookaheadSymbols: ["3"]
                },
                {
                    symbols: ["4"], //or
                    lookaheadSymbols: ["4"]
                },
                {
                    symbols: ["5"], //xor
                    lookaheadSymbols: ["5"]
                },
                {
                    symbols: ["8"], //iff
                    lookaheadSymbols: ["8"]
                }
            ]
        },
    ],
    terminationSymbol: "#",
}

var la = new LexicalAnalyzer(lexicalAnalyzerParameter);
var pda = new PushdownAutomata(pushdownParameter)

console.log("Dictionary / Finite Automata")
console.log(la.dictionary)


function checkToken(){
    var strings = document.getElementById("stringstext").value
    console.log("Tokens: "+ la.getAllAutomataToken(strings))
    document.getElementById("ouputtoken").innerHTML = "Output: "+la.getAllAutomataToken(strings).toString()
    document.getElementById("outputvalid").innerHTML = "Validity: " + pda.getTokenValidity(la.getAllAutomataToken(strings)).toString()
        
}

//then the th t