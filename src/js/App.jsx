import React from 'react'; 
import ReactDOM from 'react-dom'; 
import '../style.css';
import soundfile from '../dog_barking.mp3'; 

'use strict'; 

function Screen(props) {
    var leftPad = (o) => ('0' + o).slice(-2);
    var time = props.time; 
    var seconds = time % 60; 
    var minutes = Math.floor(time / 60) % 60; 
    var hours = Math.floor(time / 3600); 
    return(
        <div id='screen' >
            <span id='hours'>{  leftPad(hours)  }</span>
            <span className='sep'>h </span>
            <span id='minutes'>{leftPad(minutes)}</span>
            <span className='sep'>m </span>
            <span id='seconds'>{leftPad(seconds)}</span>
            <span className='sep'>s</span>
        </div>
    )
}



class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            time: 1, //max time is 35999
            maxtime:25 * 60,
            paused: true,
            manualHours: 0,
            manualMinutes:0,
            manualSeconds:0
        }
        this.startstopPress = this.startstopPress.bind(this);
        this.setTimerMinutes = this.setTimerMinutes.bind(this); 
        this.resetTimer = this.resetTimer.bind(this);
        this.timerActions = this.timerActions.bind(this); 
        this.setManualTime = this.setManualTime.bind(this);
        this.handleManualChange = this.handleManualChange.bind(this); 
        this.sound = new Audio(soundfile); 

    }

    timerActions(){
        window.timervar = setInterval(()=> {
            this.setState((prevState) => {
                if (prevState.time === 1) {
                    this.sound.play(); 
                    clearInterval(window.timervar)
                }
                return {time: prevState.time - 1}
            })
        }, 1000)
    }

    startstopPress(){
        this.setState((prevState) => {
            var isPaused = !prevState.paused
            isPaused ? clearInterval(window.timervar) :  this.timerActions()
            return {paused: isPaused}
        })
    }

    setTimerMinutes(x){
        // x is in minutes
        this.setState({
            time: x * 60,
            maxtime: x * 60, 
            paused: true
        })
    }

    handleManualChange(name, e){
        this.setState({
            [name]: e.target.value 
        })
    }
    setManualTime(e){
        this.setState((prevState) => {
            var newTime =  prevState.manualHours * 3600 + prevState.manualMinutes*60 + prevState.manualSeconds*1; 
            return {
                time: newTime, 
                maxtime: newTime,
                paused: true
            }
        })
    }

    resetTimer(){
        clearInterval(window.timervar)
        this.sound.pause();  /* To pause the audio */
        this.sound.currentTime = 0;  /* To reset the time back to 0 */
        this.setState({
            time: this.state.maxtime,
            paused: true
        })
    }
    restrictNumericInput(e){ 
        myInput.oninput = function () {
            if (this.value.length > 2) {
                this.value = this.value.slice(0,2); 
            }
        }
    }
    render(){
        var startstop_text = this.state.paused ? "Start":  "Pause"; 
        return (
            <div id='timer-app'> 
                <Screen time={this.state.time}></Screen>
                <div id='control-buttons'>
                    <button id='startstop' onClick={this.startstopPress}>{startstop_text}</button>
                    <button id='reset' onClick={this.resetTimer} > Reset</button>
                </div>
                <hr className='spacer'/>
                <div id='timecontrol'>
                    <fieldset id='manualtime'>
                        <legend>Enter time</legend>
                        <div id='timecontrol-flex-wrapper'>
                            <div id='manualtime-inputs'>
                                <input id='hours_input' onChange={(e)=> this.handleManualChange('manualHours', e)}  type='number' min='0' max='99' maxLength='2'/>
                                <span className='inputsep'>h </span>
                                <input id='minutes_input' onChange={(e)=> this.handleManualChange('manualMinutes', e)} type='number' min='0' max='59' maxLength='2'/>
                                <span className='inputsep'>m </span>
                                <input id='seconds_input' onChange={(e)=> this.handleManualChange('manualSeconds', e)} type='number' min='0' max='59' maxLength='2'/>
                                <span className='inputsep'>s </span>
                            </div>
                            <button id='manualtime-button' onClick={this.setManualTime}>Submit</button>
                        </div>
                    </fieldset>
                    <fieldset id='quickdiv'>
                        <legend>Quick choices (min)</legend>
                        <div id='quickchoices-buttons'>
                            <button className='quickop' onClick={() => this.setTimerMinutes(5)}>5</button>
                            <button className='quickop' onClick={() => this.setTimerMinutes(10)}>10</button>
                            <button className='quickop' onClick={() => this.setTimerMinutes(25)}>25</button>
                            <button className='quickop' onClick={() => this.setTimerMinutes(30)}>30</button>
                            <button className='quickop' onClick={() => this.setTimerMinutes(45)}>45</button>
                            <button className='quickop' onClick={() => this.setTimerMinutes(60)}>60</button> 
                        </div>
                    </fieldset>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'));
