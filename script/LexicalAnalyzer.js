class LexicalAnalyzer{
    constructor(parameters){
        //Attributes
        this.dictionary = {
            _ROOT_: {}
        }
        this.separator = parameters.separator ? parameters.separator : []

        //Initialize
        this.initLexicals(parameters.lexicals, parameters.buildDictionaryWithAutomataState, parameters.groupingSymbols)
    }

    initLexicals(lexicals, buildDictionaryWithAutomataState, groupingSymbols = null){
        if(!buildDictionaryWithAutomataState){
            this.buildDictionary(lexicals)
        }else{
            this.buildAutomata(lexicals)
            this.addGroupingSymbolsState(groupingSymbols.start, groupingSymbols.end)
            this.addSeparatorTransition()
        }
    }

    /**
     * 
     * @param {any[]} lexicals 
     */
    buildDictionary(lexicals){
        if(lexicals instanceof Array && lexicals.length > 0){
            lexicals.forEach( lexical => {
                this.addDictionary(lexical.string, lexical.token);
            });
        }
    }

    /**
     * Methods that add string lexical to analyzers dictionary
     *  * The string cannot contains any spaces between or else the spaces will be remove
     *  --  Example: stringLexical = `spaces between` would read as `spacesbetween`
     * @param {string} stringLexical string lexical that will be added to dictionary
     * @param {number} returnToken token value
     */
    addDictionary(stringLexical, returnToken){
        //Preprocessing
        stringLexical = stringLexical.replace(/ /g,)
        if(this.toStateWithString(stringLexical)){
            return;
        }

        var currentState = this.dictionary
        for(var char of stringLexical){
            if(!currentState[char]){
                currentState[char] = {}
            }else{
                if(typeof currentState[char] !==  "object"){
                    var prevTokenValue = currentState[char];
                    currentState[char] = {}
                    currentState[char]['FINAL'] = prevTokenValue;
                }
            }
            currentState = currentState[char]
        }

        this.toStateWithString(stringLexical.slice(0, -1))[stringLexical[stringLexical.length - 1]] = returnToken
    }


    /**
     * Returns token on given lexic
     * * if lexic is not in dictionry will return string `error`
     * @param {string} lexic 
     * @return {any} value of the lexic given based on LA dictionary || either error or some values
     */
    getToken(lexic){
        var lastState = this.toStateWithString(lexic);
        if(lastState != null){
            if(lastState['FINAL']){
                return lastState['FINAL']
            }
            if(typeof lastState !== 'object'){
                return lastState
            }
        }
        return 'error'
        
    }

    /**
     * Returns dictionary state reference based on lexic
     * @param {string} lexic 
     * @return {object} object that reference to it lexic based on LA dictionary
     */
    toStateWithString(lexic){
        var pointerState = this.dictionary
        for(var char of lexic){
            pointerState = pointerState[char] ? pointerState[char] : null
            if(!pointerState){
                return null
            }
        }
        return pointerState
    }

    /**
     * Returns list of token string based on string
     * * Checking token of each string that separated by LA separator
     * @param {string} strings 
     * @return {string[]} array of string on given string
     */
    getAllToken(string){
        var chars = ""
        var tokens = []
        for(var char of string){
            if(this.separator == char){
                if(chars){
                    var charsToken = this.getToken(chars)
                    if(charsToken == 'error'){
                        return tokens;
                    }else{
                        tokens.push(charsToken)
                    }
                }

                //Separator token
                var separatorToken = this.getToken(char)
                if(separatorToken != 'error'){
                    tokens.push(separatorToken)
                }
                chars = ""
            }else{
                chars += char
            }
        }

        //Add last char token if not seperator
        if(!this.separator == char){
            var charsToken = this.getToken(chars)
            if(charsToken == 'error'){
                return tokens;
            }else{
                tokens.push(charsToken)
            }
        }

        return tokens
    }

    //#region Automata
    /**
     * Build finite automata and set it to dictionary
     * @param {any[]} lexicals 
     */
    buildAutomata(lexicals){
        if(lexicals instanceof Array && lexicals.length > 0){
            lexicals.forEach( lexical => {
                this.addAutomataState(lexical.string, lexical.token, lexical.epsilonMoveTo);
            });
        }
    }

    /**
     * Adding state to selected state
     * @param {string} stringLexical 
     * @param {any} returnToken 
     */
    addAutomataState(stringLexical, returnToken, epsilonMoveTo = null){
        //Preprocessing
        stringLexical = stringLexical.replace(/ /g,)

        var lastStatePointer
        var currentChars ="", prevChars = ""
        var currentState = this.dictionary

        if(!this.dictionary[stringLexical[0]]){
            this.dictionary['_ROOT_'][stringLexical[0]] = stringLexical[0]
        }


        for(var char of stringLexical){
            currentChars += char
            if(!currentState[currentChars]){
                currentState[currentChars] = {}
            }

            if(prevChars){
                currentState[prevChars][char] = currentChars
            }

            prevChars = currentChars
            lastStatePointer = currentState[currentChars]
        }

        lastStatePointer.isFinal = true
        lastStatePointer.token = returnToken
    
        if(epsilonMoveTo){
            lastStatePointer.epsilonMoveTo = epsilonMoveTo
            this.dictionary[epsilonMoveTo].isFinal = true
        }
    }

    /**
     * Add group symbols to finite state
     * * Start Group symbols will have a epsilon move to any state
     * * End Group symbols will transitioned from all final state except state that have same token (or same state)
     * @param {any[]} startGrupingSymbols 
     * @param {any[]} endGroupingSymbols 
     */
    addGroupingSymbolsState(startGrupingSymbols, endGroupingSymbols){
        //Add Grouping Symbols
        for(var startGrupingLexical of startGrupingSymbols){
            this.addAutomataState(startGrupingLexical.string, startGrupingLexical.token, startGrupingLexical.epsilonMoveTo)
        }
        for(var endGrupingLexical of endGroupingSymbols){
            this.addAutomataState(endGrupingLexical.string, endGrupingLexical.token, endGrupingLexical.epsilonMoveTo)
        }


        //End Grouping Symbols
        var allFinalState = this.getAllFinalState(this.dictionary)
        for(var finalState of allFinalState){
            for(var endGrupingLexical of endGroupingSymbols){
                if(finalState.token != endGrupingLexical.token && !finalState.epsilonMoveTo){
                    finalState[endGrupingLexical.string[0]] = endGrupingLexical.string[0]
                }
            }
        }
    }

    addSeparatorTransition(){
        for(var state of this.getAllFinalState(this.dictionary)){
            if(!state.epsilonMoveTo){
                state[this.separator] = '_ROOT_'
            }
        }

        //Separator on root back to root (loop)
        this.dictionary['_ROOT_'][this.separator] = '_ROOT_'
    }



    /**
     * Return all final states in finite automata
     * @param {obj} states 
     * @return {obj[]} finalStates
     */
    getAllFinalState(states){
        let finalStates = []
        for (var state in states){
            if(states.hasOwnProperty(state)){
                if(states[state].isFinal){
                    finalStates.push(states[state])
                }
            }
        }

        return finalStates
    }

    getAllAutomataToken(string){
        var currentState = this.dictionary._ROOT_
        var tokens = []
        var lastToken
        var nextState
        var indexChar = 0
        do{
            var char = string[indexChar]

            //Read
            nextState = currentState[char]

            //Transition
            currentState = this.dictionary[nextState]

            //Check epsilon moves
            if(currentState && currentState.epsilonMoveTo){
                //Push token if current is final and there's last token
                if(lastToken){
                    tokens.push(lastToken)
                }
                if(currentState.isFinal){
                    tokens.push(currentState.token)
                }

                nextState = currentState.epsilonMoveTo
                currentState = this.dictionary[nextState]
                lastToken = null
            }
            
            if(!currentState){
                tokens.push('error')
                return tokens
            }

            if(currentState.isFinal){
                if(currentState.token){
                    lastToken = currentState.token
                }
            }

            if(char == this.separator){ //read space and push token
                if(lastToken){
                    tokens.push(lastToken)
                    lastToken = null
                }
            }

            indexChar++
        }while(string[indexChar])

        //EOS
        if(!currentState.isFinal){
            tokens.push('error')
            return tokens
        }else{
            if(lastToken){
                tokens.push(lastToken)
            }
        }

        return tokens
    }

    //#endregion
}