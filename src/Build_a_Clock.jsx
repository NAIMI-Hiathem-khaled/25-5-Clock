import React, { useState, useEffect, useRef } from "react";
import sound from "./sound.mp3";

function Build_a_Clock() {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);
    const [switch_, setSwitch_] = useState(true);
    const [breakL, setBreakL] = useState(5);
    const [sessionL, setSessionL] = useState(25);
    const audioRef = useRef(null);

    // Convert session and break lengths to milliseconds
    const sessionTime = sessionL * 60 * 1000;
    const breakTime = breakL * 60 * 1000;

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio(sound);
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                const currentElapsed = Date.now() - startTimeRef.current;
                setElapsedTime(currentElapsed);

                // Check if we're in the last 2 seconds
                const timeRemaining = switch_ ? sessionTime - currentElapsed : breakTime - currentElapsed;
                if (timeRemaining <= 2000 && timeRemaining > 0) {
                    // Play sound only if not already playing
                    if (audioRef.current.paused) {
                        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                    }
                }
            }, 10);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        };
    }, [isRunning, switch_, sessionTime, breakTime]);

    // Handle session/break switching
    useEffect(() => {
        if (switch_ && elapsedTime >= sessionTime) {
            reset();
            setSwitch_(false);
            document.body.style.backgroundColor = "red";
            startTimeRef.current = Date.now();
            setIsRunning(true);
        } else if (!switch_ && elapsedTime >= breakTime) {
            reset();
            setSwitch_(true);
            document.body.style.backgroundColor = "green";
            startTimeRef.current = Date.now();
            setIsRunning(true);
        }
    }, [elapsedTime, switch_, sessionTime, breakTime]);

    function handleaddbreakL() {
        if (breakL < 60) {
            setBreakL(c => c + 1);
        }
    }

    function handlesubbreakL() {
        if (breakL > 1) {
            setBreakL(c => c - 1);
        }
    }

    function handleaddsession() {
        if (sessionL < 60) {
            setSessionL(c => c + 1);
        }
    }

    function handlesubsession() {
        if (sessionL > 1) {
            setSessionL(c => c - 1);
        }
    }

    function start() {
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
    }

    function stop() {
        setIsRunning(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    function reset() {
        setElapsedTime(0);
        setIsRunning(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    function formatTime() {
        const timeRemaining = switch_ ? sessionTime - elapsedTime : breakTime - elapsedTime;
        const displayTime = Math.max(0, timeRemaining);
        
        let minutes = Math.floor(displayTime / (1000 * 60));
        let seconds = Math.floor((displayTime % (1000 * 60)) / 1000);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className='main_box'>
            <div className="box1">
                <h4>Break Length</h4>
                <button onClick={handlesubbreakL}>-</button>
                <h4>{breakL}</h4>
                <button onClick={handleaddbreakL}>+</button>
            </div>

            <div className="box2">
                <h4>Session Length</h4>
                <button onClick={handlesubsession}>-</button>
                <h4>{sessionL}</h4>
                <button onClick={handleaddsession}>+</button>
            </div>
            <div className='display'>{formatTime()}</div>
            <div className="controls">
                <button onClick={start} className="start-button">Start</button>
                <button onClick={stop} className="start-button">Stop</button>
                <button onClick={reset} className="start-button">Reset</button>
            </div>
                    <p>Designed and Coded by</p>
                    <h4>NAIMI Haithem khaled</h4>
        </div>

    );
}

export default Build_a_Clock;