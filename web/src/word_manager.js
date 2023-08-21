import React from 'react'
import UserIO from './userio'

const verb_I_end = ["aa", "ää", "ea", "eä", "ia", "iä", "oa", "ua", "yä", "öä"]
const verb_II_end = ["da", "dä"]
const verb_III_end = ["lla", "llä", "nna", "nnä", "rra", "rrä", "sta", "stä"]
const verb_IV_end = ["ata", "ätä", "ota", "ötä", "uta", "ytä"]
const verb_V_end = ["ita", "itä"]
const verb_VI_end = ["eta", "etä"]

class WordManager extends React.Component {
    constructor(props) {
        super(props);
        this.topWords = props.top;
        this.kotusWords = props.kotus;
        this.topWordsKeys = Object.keys(this.topWords);
        this.kotusWordsKeys = Object.keys(this.kotusWords);
        this.mode = props.mode;
        this.verbgroups = props.enabledVerbgroups;
        this.state = {
            currentWord: "",
            currentAnswer: "",
            currentTranslation: "",
            currentKotusType: "",
            currentFormName: "",
        };
    }

    componentDidMount() {
        this.generateNewWord();
    }

    // generates new word based on current settings
    generateNewWord = () => {
        let currentData;
        if (this.props.currentData === 'kotus') {
            currentData = {
                keys: Object.keys(this.props.kotus),
                data: this.props.kotus
            };
        } else {
            currentData = {
                keys: Object.keys(this.props.top),
                data: this.props.top
            };
        }
        let wordIndex;
        let word;

        this.verbgroups = this.props.enabledVerbgroups;

        while(true) {
            wordIndex = Math.floor(Math.random() * currentData.keys.length);
            word = currentData.keys[wordIndex];

            if (this.mode === "verbs") {
                let ending_two = word.slice(-2);
                let ending_three = word.slice(-3);

                if(
                    (this.verbgroups[0] && verb_I_end.includes(ending_two))//valid under this verb group
                    || (this.verbgroups[1] && verb_II_end.includes(ending_two))
                    || (this.verbgroups[2] && verb_III_end.includes(ending_three))
                    || (this.verbgroups[3] && verb_IV_end.includes(ending_three))
                    || (this.verbgroups[4] && verb_V_end.includes(ending_three))
                    || (this.verbgroups[5] && verb_VI_end.includes(ending_three))
                ){
                    break;
                }
            }
            else break;
        }

        // console.log(this.props.formsOn, this.props.formsOn.map(el => (el && el !== -1 ? el : 0)))
        const formsOnCount = this.props.formsOn.map(el => (el && el !== -1 ? el : 0)).reduce((a, b) => a + b);
        let formSubsetIndex = Math.floor(Math.random() * formsOnCount);
        let trueFormIndex = 0;

        // since index was generated based on the number of forms turned on, 
        // it is now necessary to find the index of the x-th form that is on
        for (let i = 0; i < this.props.forms.length; ++i) {
            if (this.props.formsOn[i] && this.props.formsOn[i] !== -1) {
                formSubsetIndex--;
            }
            if (formSubsetIndex < 0) {
                break;
            }
            trueFormIndex++;
        }

        // console.log(formsOnCount, trueFormIndex);

        let currentEntry = currentData.data[word];
        // console.log(currentEntry)
        this.setState({
            currentWord: word,
            currentFormName: this.props.forms[trueFormIndex],
            currentAnswer: this.props.generateForm(currentEntry.forms,trueFormIndex),
            currentTranslation: currentEntry.tran,
            currentKotusType: currentEntry.kotus
        })
        console.log(this.state.currentAnswer)
    }

    onCorrectAnswer = () => {
        this.generateNewWord();
    }

    render() {
        return (
            <UserIO onCorrectAnswer={this.onCorrectAnswer} currentWord={this.state.currentWord}
                currentAnswer={this.state.currentAnswer} currentTranslation={this.state.currentTranslation}
                currentKotusType={this.state.currentKotusType} currentFormName={this.state.currentFormName} />
        )
    }
}

export default WordManager