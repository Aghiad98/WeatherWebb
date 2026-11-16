import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

const LOCALES = { ar: 'ar-u-nu-latn', en: 'en-GB' }
function formatDateTime(date, locale) {
  return new Intl.DateTimeFormat(LOCALES[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Damascus',
  }).format(date)
}


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function App() {
  const { t, i18n } = useTranslation();

/* =====States====== */
 
  const [now , setNow] = useState(() => new Date())
  const [temp , setTemp] = useState({
    number:null,
    description:"",
    min:null,
    max:null,
    icon:null
  }) ;

  //
  const locale = i18n.language?.startsWith("en") ? "en" : "ar"
  const dateAndtime = formatDateTime(now, locale)

   /* ========useEffect====== */
  
  useEffect(()=>{
    i18n.changeLanguage(localStorage.getItem("lang") || "ar")
  },[])

  // 
  useEffect(()=>{
    const id = setInterval(()=> setNow(new Date()), 1000)
    return ()=> clearInterval(id)
  },[])

  //
  useEffect(()=>{
    document.documentElement.lang = locale
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
  },[locale])

  // 
  useEffect(()=>{
   const controller = new AbortController();
  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=33.5102&lon=36.29128&appid=${API_KEY}&units=metric&lang=${locale}`,{
     signal: controller.signal
  })
  .then(function(response){
    const responseTemp = Math.round(response.data.main.temp)  ;
    const responseDescription = response.data.weather[0].description ;
    const responseTempMin = Math.round(response.data.main.temp_min)  ;
    const responseTempMax = Math.round(response.data.main.temp_max)  ;
    const responseIcon = response.data.weather[0].icon ;

    setTemp({
      number:responseTemp ,
       description:responseDescription ,
       min:responseTempMin ,
       max:responseTempMax ,
       icon:`https://openweathermap.org/img/wn/${responseIcon}@2x.png`
      })
  }).catch((error) => {
  if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
    return;
  }

  console.error("Weather API Error:", error);
});
  return ()=>{
    controller.abort()
  }
 }, [locale] )

 /* =========== handleLanguage ============ */

function handlelanguage(){
  const next = locale === "ar" ? "en" : "ar"
  i18n.changeLanguage(next)
  localStorage.setItem("lang", next)
}
  return (
    <>
      <div  className='counter'>
        {/* ===card==== */}
        <div className={locale=="ar" ? "card-ar" : "card-en"}  >
           {/*====== content======== */}
           <div className='content'>
            {/*==== city & time ======*/}
            <div className='city-time' >
              <div>
                   <h2 className='city'> {t("Damascus")} </h2>
              </div>
           <div>
              <h5 className='time'>{dateAndtime}</h5>
           </div>
            
            </div>
             {/*==== city & time ======*/}
            <hr/>
            {/*===== degree & description =======*/}
            <div className=' degree-description '>
              {/* temp */}
              <div className='tempreture'>
                <h1>  { temp.number !== null ? `${temp.number}°C` : "جاري تحميل الطقس..."} </h1>
              {/* temp img todo */}
              <img src={ temp.icon } />
              </div>
              {/* temdesp  */}
              <div className='temdesp'>
                <h6>{temp.description}</h6>
              </div>
              {/* the hight degree and low degree */}
              <div className='tempDegree'>
                <h5>{t("min")} : {temp.min} </h5>
                <p>|</p>
                <h5>{t("max")} : {temp.max}</h5>
              </div>
            </div>
            {/*===== degree & description =======*/}
           </div>
            {/*====== content======== */}
        </div>
        <button onClick={handlelanguage}>
          {locale == "en" ? "Arabic":"English" }
        </button>
          {/* ===card==== */}
      </div>
    </>
  )
}

export default App