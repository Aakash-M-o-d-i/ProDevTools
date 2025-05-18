
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 Enum for tracking timer state
 */
enum TimerState {
  IDLE,
  RUNNING,
  PAUSED,
  FINISHED
}

/**
 PomodoroPage Component
  
 A pomodoro timer application that helps users implement the 
 Pomodoro Technique for time management and productivity.
 */
const PomodoroPage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(22 * 60); // 25 minutes in seconds
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  
  // Settings
  const [workDuration, setWorkDuration] = useState(22); // 22 minutes
  const [breakDuration, setBreakDuration] = useState(5); // 5 minutes
  const [isBreak, setIsBreak] = useState(false); // Flag to indicate if in break mode
  
  // Timer countdown effect
  // This effect runs when the timer state changes
  // and updates the time left every second if the timer is running.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (timerState === TimerState.RUNNING) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            setTimerState(TimerState.FINISHED);
            
            // Play sound notification
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch((e) => console.error("Audio play error:", e));
            
            // Show toast notification
            toast({
              title: isBreak ? "Break finished!" : "Work session finished!",
              description: isBreak ? "Time to work!" : "Time for a break!",
              action: (
                <Button size="sm" variant="outline" onClick={() => switchMode()}>
                  <Bell className="h-4 w-4 mr-1" /> Switch
                </Button>
              )
            });
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    // Cleanup interval on unmount or when timer state changes
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, isBreak, toast]);
  
  /**
   Start or resume the timer
   */
  const startTimer = () => {
    setTimerState(TimerState.RUNNING);
  };
  
  /**
  Pause the running timer
   */
  const pauseTimer = () => {
    setTimerState(TimerState.PAUSED);
  };
  
  /**
  Reset the timer to initial state
   */
  const resetTimer = () => {
    setTimerState(TimerState.IDLE);
    setTimeLeft(isBreak ? breakDuration * 60 : workDuration * 60);
  };
  
  /**
  Switch between work and break modes
   */
  const switchMode = () => {
    setIsBreak(!isBreak);
    setTimeLeft((isBreak ? workDuration : breakDuration) * 60);
    setTimerState(TimerState.IDLE);
  };
  
  /**
  Handle changes to work duration
   */
  const handleWorkDurationChange = (value: string) => {
    const newDuration = parseInt(value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      setWorkDuration(newDuration);
      if (!isBreak && timerState !== TimerState.RUNNING) {
        setTimeLeft(newDuration * 60);
      }
    }
  };
  
  /**
  Handle changes to break duration
   */
  const handleBreakDurationChange = (value: string) => {
    const newDuration = parseInt(value, 10);
    if (!isNaN(newDuration) && newDuration > 0) {
      setBreakDuration(newDuration);
      if (isBreak && timerState !== TimerState.RUNNING) {
        setTimeLeft(newDuration * 60);
      }
    }
  };
  
  /**
  Format seconds into mm:ss display
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  /**
  Calculate progress percentage for visual indicator
   */
  const calculateProgress = () => {
    const totalSeconds = isBreak ? breakDuration * 60 : workDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  // Calculate circle properties for timer visualization
  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 120; // Circle circumference (2πr)
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
      </div>

      {/* Timer display */}
      <div className="flex flex-col items-center justify-center my-8">
        {/* Timer circle visualization */}
        <div className="pomodoro-timer relative">
          <svg width="260" height="260" viewBox="0 0 260 260">
            {/* Background circle */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="transparent"
              stroke={isBreak ? "#93c5fd" : "#f87171"}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 130 130)"
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
            <div className="text-lg mt-2">
              {isBreak ? "Break Time" : "Focus Time"}
            </div>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex space-x-3 mt-8">
          {timerState === TimerState.RUNNING ? (
            <Button onClick={pauseTimer} variant="outline" size="lg">
              <Pause className="h-5 w-5 mr-2" /> Pause
            </Button>
          ) : (
            <Button onClick={startTimer} size="lg">
              <Play className="h-5 w-5 mr-2" /> {timerState === TimerState.PAUSED ? "Resume" : "Start"}
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5 mr-2" /> Reset
          </Button>
          <Button onClick={switchMode} variant="secondary" size="lg">
            Switch to {isBreak ? "Work" : "Break"}
          </Button>
        </div>
      </div>

      {/* Timer settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work duration settings */}
        <Card>
          <CardHeader>
            <CardTitle>Work Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workDuration">Work Duration (minutes)</Label>
                <Input
                  id="workDuration"
                  type="number"
                  min="1"
                  max="60"
                  value={workDuration}
                  onChange={(e) => handleWorkDurationChange(e.target.value)}
                  disabled={timerState === TimerState.RUNNING && !isBreak}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Break duration settings */}
        <Card>
          <CardHeader>
            <CardTitle>Break Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                <Input
                  id="breakDuration"
                  type="number"
                  min="1"
                  max="30"
                  value={breakDuration}
                  onChange={(e) => handleBreakDurationChange(e.target.value)}
                  disabled={timerState === TimerState.RUNNING && isBreak}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pomodoro technique information */}
      <Card>
        <CardHeader>
          <CardTitle>What is the Pomodoro Technique?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as "pomodoros". After four pomodoros, take a longer break of 15-30 minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroPage;
