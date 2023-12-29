import { Divider } from '@mui/material';
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Unstable_Grid2';
import Prayer from './Prayer';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment'
import 'moment/dist/locale/ar'
moment.locale('ar');
export default function MainContent () {
  
  // STATES
  const [timings,setTimings] = useState({ Fajr: '05:12',Dhuhr: '12:00',Asr: '3:10',Maghrib: '05:30',Isha: '7:30' });
  const [selectedCity,setSelectedCity] = useState({ displayName: 'القاهرة',apiName: 'Cairo' });
  const [today,setToday] = useState('');
  const [nextPrayerIndex, setNextPrayerIndex] = useState(1);
  const [remainingTime, setRemainingTime] = useState('');
  const availableCity = [
    { displayName: "(مكه المكرمه) السعوديه",apiName: "Makkah al Mukarramah" },
    { displayName: "(المدينة المنورة) السعوديه",apiName: "Madinah" },
    { displayName: "(الرياض) السعوديه",apiName: "Riyadh" },
    { displayName: "(بغداد) العراق",apiName: "Baghdad" },
    { displayName: "(عمّان) الاردن",apiName: "Amman" },
    { displayName: "(دبي) الامارات العربيه المتحده",apiName: "Dubi" },
    { displayName: "(الدوحة) قطر",apiName: "Doha" },
    { displayName: "(القاهرة) مصر",apiName: "Cairo" },
    { displayName: "(طرابلس) ليبيا",apiName: "Tripoli" },
    { displayName: "تونس",apiName: "Tunisia" },
    { displayName: "الجزائر",apiName: "Algeria" },
    { displayName: "(الرباط) المغرب",apiName: "Rabat" },
    { displayName: "(لندن) انجلترا",apiName: "London" },
    { displayName: "(برلين) المانيا",apiName: "Berlin" },
    { displayName: "(ميلان) ايطاليا",apiName: "Milan" },
    { displayName: "(مدريد) اسبانيا",apiName: "Madrid" },
    { displayName: "(باريس) فرنسا",apiName: "Paris" },
    { displayName: "الولايات المتحده الأمريكيه (واشنطن)",apiName: "Washington, D.C." },
    { displayName: "(أوتاوا) كندا",apiName: "Ottawa" },
    { displayName: "(ساو باولو) البرازيل",apiName: "Sao Paulo" },
    { displayName: "(بوينس إيرس) الأرجنتين",apiName: "Buenos Aires" },
  ];

  const prayersArray = [
    { key: 'Fajr', displayName:'الفجر' },
    { key: 'Dhuhr', displayName:'الظهر' },
    { key: 'Asr', displayName:'العصر' },
    { key: 'Maghrib', displayName:'المغرب' },
    { key: 'Isha', displayName:'العشاء' },
  ]

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/28-12-2023?country=&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => { getTimings() },[selectedCity])


  useEffect(() => {
    setToday(moment().format("Do MMM YYYY"));

    const interval = setInterval(() => {
      setUpCountDownTimer();
    },1000);

    return () => clearInterval(interval);
  },[selectedCity]);



  function setUpCountDownTimer () {
    const momentNow = moment();
    let nextPrayer = 2;

    if (momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))) {
      nextPrayer = 1;
    } else if (momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) && momentNow.isBefore(moment(timings["Asr"],"hh:mm"))) {
      nextPrayer = 2;
    } else if (momentNow.isAfter(moment(timings["Asr"],"hh:mm")) && momentNow.isBefore(moment(timings["Maghrib"],"hh:mm"))) {
      nextPrayer = 3;
    } else if (momentNow.isAfter(moment(timings["Maghrib"],"hh:mm")) && momentNow.isBefore(moment(timings["Isha"],"hh:mm"))) {
      nextPrayer = 4;
    } else { nextPrayer = 0 }
    setNextPrayerIndex(nextPrayer);

    const nextPrayerObject = prayersArray[nextPrayer];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    
    //  حساب الفارق الزمني بين الوقت الحالي ووقت الصلاه
    let remainingTime = moment(nextPrayerTime, 'hh:mm').diff(momentNow);

    //  تحويل الزمن لساعات ودقائق 
    const duractionRemainingTime = moment.duration(remainingTime);

    if (remainingTime > 0) {
      //  الفرق بين الوقت الحالي ومنتصف الليل
      const midNightDiff = moment('23:59:59', "hh:mm:ss").diff(momentNow);

      //  الفرق بين منتصف الليل والفجر
      const fajrToMidNightDiff = nextPrayerTimeMoment.diff(moment('00:00:00', "hh:mm:ss"));
      
      const totalDiff = midNightDiff + fajrToMidNightDiff;
      
      remainingTime = totalDiff;
    }
    
    setRemainingTime(`${duractionRemainingTime.seconds()} : ${duractionRemainingTime.minutes()} : ${duractionRemainingTime.hours()}`);
  }



    function handleCityChange (event) {
      const cityObject = availableCity.find((city) => city.apiName == event.target.value);
      setSelectedCity(cityObject);
    }


    
    return (
      <>
        {/* TOP ROW */}
        <Grid
          container
          className="stack">
          <Grid xs={6}>
            <div style={{ textAlign: "center" }}>
              <h2> {selectedCity.displayName} </h2>
              <h3 style={{ fontWeight: "lighter" }}> {today} </h3>
            </div>
          </Grid>
          <Grid xs={6}>
            <div style={{ textAlign: "center" }}>
              <h3>
                متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName}{" "}
              </h3>
              <h2 style={{ fontWeight: "lighter" }}> {remainingTime} </h2>
            </div>
          </Grid>
        </Grid>
        {/*=== TOP ROW ===*/}

        <Divider
          className='divider'
          variant="middle"
          style={{ background: "#fff", opacity: "0.1" }}
        />

        {/* PRAYERS CARDS */}
        <Stack
          className="stack"
          direction="row"
          justifyContent={"space-evenly"}
          style={{ marginTop: "50px" }}>
          <Prayer
            name="الفجر"
            time={timings.Fajr}
            img="https://istanbulclues.com/wp-content/uploads/2022/10/Blue-Mosque-V3-iStock.jpg"
          />
          <Prayer
            name="الظهر"
            time={timings.Dhuhr}
            img="https://www.prayertime.online/wp-content/uploads/2018/10/mecca.webp"
          />
          <Prayer
            name="العصر"
            time={timings.Asr}
            img="https://images.hive.blog/0x0/https://files.peakd.com/file/peakd-hive/hoosie/Ep5nDyVkduKro2nXz4k7HmhW8vEuDX1aHRdHq9U6VfctpywamzJuZR6VM8hxYXq57D9.jpeg"
          />
          <Prayer
            name="المغرب"
            time={timings.Maghrib}
            img="https://c1.wallpaperflare.com/preview/979/440/919/suleymaniye-mosque-mosque-emin%C3%B6n%C3%BC-gulls.jpg"
          />
          <Prayer
            name="العشاء"
            time={timings.Isha}
            img="https://img.freepik.com/premium-photo/blue-mosque-night-with-moon-background_807701-5357.jpg"
          />
        </Stack>
        {/* ===PRAYERS CARDS ===*/}

        {/* SELECT CITY */}
        <Stack
          className="select"
          direction="row"
          justifyContent={"center"}
          style={{ marginTop: "50px" }}>
          <FormControl style={{ width: "20%" }} className='formControl'>
            <InputLabel
              id="demo-simple-select-label"
              style={{ color: "#fff" }}>
              المدينه
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              onChange={handleCityChange}
              style={{ color: "#fff" }}>
              {availableCity.map((city) => {
                return (
                  <MenuItem
                    value={city.apiName}
                    key={city.apiName}>
                    {" "}
                    {city.displayName}{" "}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        {/*=== SELECT CITY ===*/}
      </>
    );
  }
