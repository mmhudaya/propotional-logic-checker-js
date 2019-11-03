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

var la = new LexicalAnalyzer(lexicalAnalyzerParameter);

console.log("Dictionary / Finite Automata")
console.log(la.dictionary)


function checkToken(){
    var strings =document.getElementById("stringstext").value
    if(lexicalAnalyzerParameter.buildDictionaryWithAutomataState){
        console.log("Tokens: "+ la.getAllAutomataToken(strings))
        document.getElementById("ouputtoken").innerHTML = "Output: "+la.getAllAutomataToken(strings).toString()
    }else{
        console.log("Tokens: "+la.getAllToken(strings))
        document.getElementById("ouputtoken").innerHTML = "Output: "+la.getAllToken(strings).toString()
    }
}

//then the th t