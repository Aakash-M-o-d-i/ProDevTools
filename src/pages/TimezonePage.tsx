
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 TimezonePage Component
  
 A timezone converter tool that allows users to convert time between
 different timezones around the world.
 */
const TimezonePage = () => {
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // Current date and time
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected source and target timezones
  const [sourceTimezone, setSourceTimezone] = useState("Etc/UTC");
  const [targetTimezone, setTargetTimezone] = useState("America/New_York");
  
  // Custom time input for source timezone
  const [customTime, setCustomTime] = useState("");
  
  // Conversion result
  const [conversionResult, setConversionResult] = useState("");
  
  // Common timezones for the dropdown
  const timezones = [
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Etc/UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
    { value: "America/Chicago", label: "Chicago (CST/CDT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
  ];
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time based on locale and timezone
  const formatTimeInTimezone = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "long",
    }).format(date);
  };
  
  // Convert time from source to target timezone
  // This function takes the current date and time
  // formats it according to the source timezone
  const convertTime = () => {
    try {
      let dateToConvert = currentDate;
      
      // If custom time is provided, use it instead of current time
      if (customTime) {
        const [hours, minutes] = customTime.split(":").map(Number);
        dateToConvert = new Date(currentDate);
        dateToConvert.setHours(hours, minutes, 0);
      }
      
      // Format result for both timezones
      const sourceFormatted = formatTimeInTimezone(dateToConvert, sourceTimezone);
      const targetFormatted = formatTimeInTimezone(dateToConvert, targetTimezone);
      
      // Set the formatted result
      setConversionResult(`${sourceFormatted} → ${targetFormatted}`);
      
      toast({
        title: "Time Converted",
        description: "Timezone conversion completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "Failed to convert between timezones.",
        variant: "destructive",
      });
    }
  };
  
  // Copy result to clipboard
  const copyResultToClipboard = () => {
    navigator.clipboard.writeText(conversionResult);
    toast({
      title: "Copied",
      description: "Conversion result copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Time Zone Converter</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono">
            {currentDate.toLocaleTimeString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentDate.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Source Timezone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceTimezone">Select Timezone</Label>
              <Select
                value={sourceTimezone}
                onValueChange={setSourceTimezone}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customTime">Custom Time (optional)</Label>
              <input
                id="customTime"
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use current time
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Target Timezone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="targetTimezone">Select Timezone</Label>
              <Select 
                value={targetTimezone}
                onValueChange={setTargetTimezone}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={convertTime}
              className="w-full mt-6"
            >
              Convert Time
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {conversionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Conversion Result
              <Button
                variant="outline"
                size="icon"
                onClick={copyResultToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md">
              <p className="whitespace-pre-wrap">{conversionResult}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>About Time Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Time zones are regions of the globe that observe a uniform standard time for legal, commercial, and social purposes. 
            Time zones tend to follow the boundaries of countries and their subdivisions because it is convenient for areas 
            in close commercial or other communication to keep the same time.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-1 text-sm">
            <li>UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time.</li>
            <li>Time zones are often expressed as positive or negative offsets from UTC.</li>
            <li>Many countries observe Daylight Saving Time (DST) during summer months.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimezonePage;
