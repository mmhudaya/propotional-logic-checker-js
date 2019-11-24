class PushdownAutomata{
    constructor(param){
        this.stack = []
        this.string = ""
        this.states = param.states || []
        this.terminationSymbol = param.terminationSymbol
    }

    initStack(){
        this.stack = []
        this.stack.push(this.terminationSymbol)
        this.stack.push(this.states.find(state => state.isRoot).terminal)
    }

    getTokenValidity(tokens){
        if(tokens[tokens.length -1 ] == "error"){
            return false
        }

        this.initStack()
        while(!this.topOfStackIsTerminationSymbol()){
            let currentSymbol = this.getTopOfStack()
            let currentState = this.states.find(state => state.terminal == currentSymbol)

            if(currentState){ //Is a state
                //Lookahead
                let pushedSymbol = null
                pushedSymbol = this.lookahead(currentState, tokens)

                this.stack.pop()
                if(pushedSymbol || pushedSymbol == "_ACCEPTEPSILON_"){
                    if(pushedSymbol != "_ACCEPTEPSILON_"){
                        this.stack.push(...pushedSymbol.reverse())
                    }
                }else{
                    return false
                }
            }else{ //Is a string
                //Read
                let token = tokens.splice(0,1)
                this.string += token
                if(this.stack.pop() != token){
                    return false
                }
            }

            //Unidentified Error
            if(this.stackIsEmpty()){
                return false
            }
        }

        this.stack.pop()

        if(tokens.length > 1){ //Token not empty
            return false
        }

        return true
    }

    lookahead(currentState, tokens){
        for(let grammar of currentState.grammar){
            for(let lookaheadSymbol of grammar.lookaheadSymbols){
                if(lookaheadSymbol == tokens.slice(0, lookaheadSymbol.length).join()){
                    if(lookaheadSymbol.length == 0){
                        return "_ACCEPTEPSILON_"
                    }

                    return JSON.parse(JSON.stringify(grammar.symbols))
                }
            }
        }
    }

    stackIsEmpty(){
        return this.stack.length == 0
    }

    topOfStackIsTerminationSymbol(){
        return this.getTopOfStack() == this.terminationSymbol
    }

    getTopOfStack(){
        // console.log("Undetermined Error");
        return this.stack[this.stack.length - 1] ? this.stack[this.stack.length - 1] :  "_FALSE_"
    }
}