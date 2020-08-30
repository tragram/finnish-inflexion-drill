import React from 'react'
import UserIO from './userio'

class WordManager extends React.Component {
    constructor(props) {
        super(props);
        this.topWords = props.top;
        this.kotusWords = props.kotus;
        this.topWordsKeys = Object.keys(this.topWords);
        this.kotusWordsKeys = Object.keys(this.kotusWords);
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
                keys: this.Object.keys(this.props.kotus),
                data: this.props.kotus
            };
        } else {
            currentData = {
                keys: Object.keys(this.props.top),
                data: this.props.top
            };
        }
        const wordIndex = Math.floor(Math.random() * currentData.keys.length);
        const word = currentData.keys[wordIndex];
        console.log(this.props.formsOn, this.props.formsOn.map(el => (el && el !== -1 ? el : 0)))
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

        console.log(formsOnCount, formSubsetIndex, trueFormIndex);

        const currentEntry = currentData.data[word];
        this.setState({
            currentWord: word,
            currentFormName: this.props.forms[trueFormIndex],
            currentAnswer: currentEntry.forms[trueFormIndex],
            currentTranslation: currentEntry.tran,
            currentKotusType: currentEntry.kotus
        })
        console.log(currentEntry.forms[trueFormIndex]);
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