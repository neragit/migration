//app/meta/page.tsx 

"use client";

import { supabase } from "../lib/supabase";
import type { AnswersState } from "@/types/answers";

import BiggerPicture from "../components/BiggerPicture";

import NewsScatter from "../components/NewsScatter";
import HoverHighlight from "../components/HoverHighlight";
import CentralQuestion from "../components/CentralQuestion";
import MetaPart4 from "../components/MetaPart4";

import BubbleChart from "../components/BubbleChart";
import ExpatBars from "../components/ExpatBars";

import MetaContainer from "../components/MetaContainer";
import MetaChart from "../components/MetaChart";
import Rezultati from "../components/Rezultati";
import Objasnjenja from "../components/Objasnjenja";

import SeeSummary from "../components/SeeSummary";

import Details from "../components/Details";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";



export default function MetaPage() {

    

    const ref = useRef<HTMLImageElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            setSessionId(crypto.randomUUID()); // generate a unique session ID for this user/session
            console.log("Generated sessionId:", sessionId);
        }
    }, []);

    const handleSeeSummary = async () => {
        console.log("Button clicked. Current state:", {
            sessionId,
            isLoading
        });

        if (!sessionId) {
            console.warn("Cannot submit: sessionId is null");
            return;
        }

        setIsLoading(true);

        try {
            // save or update
            const { error: upsertError } = await supabase
                .from("odg_migranti")
                .upsert(
                    {
                        session_id: sessionId,
                        expect_more: answers.expectMore,
                        consider_meta: answers.considerMeta,
                        uses_meta: answers.usesMeta,
                        native_language: answers.nativeLanguage,
                        meta_accuracy: answers.metaAccuracy,
                        slider_value: answers.sliderValue,
                        awareness: answers.awareness,
                        foreign_workers: answers.foreignWorkers,
                        foreign_workers_percent: answers.foreignWorkersPercent,
                        top_nationalities: answers.topNationalities,
                        nationality_search: answers.nationalitySearch,
                    },
                    { onConflict: "session_id" }
                );

            if (upsertError) throw upsertError;

            // fetch
            const { data, error: fetchError } = await supabase
                .from("odg_migranti")
                .select("*")
                .eq("session_id", sessionId)
                .single();

            if (fetchError) throw fetchError;

            // update
            setAnswers({
                expectMore: data.expect_more,
                considerMeta: data.consider_meta,
                usesMeta: data.uses_meta,
                nativeLanguage: data.native_language,
                metaAccuracy: data.meta_accuracy,
                sliderValue: data.slider_value,
                // keep other fields if needed
                awareness: answers.awareness,
                foreignWorkers: answers.foreignWorkers,
                foreignWorkersPercent: answers.foreignWorkersPercent,
                topNationalities: answers.topNationalities,
                nationalitySearch: answers.nationalitySearch,
            });

            setHasSubmitted(true);
        } catch (err) {
            console.error("Error saving or fetching answers:", err);
        } finally {
            setIsLoading(false);
        }
    };



    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const contentRef1 = useRef<HTMLDivElement>(null);
    const contentRef2 = useRef<HTMLDivElement>(null);
    const contentRef3 = useRef<HTMLDivElement>(null);
    const [height1, setHeight1] = useState(0);
    const [height2, setHeight2] = useState(0);
    const [height3, setHeight3] = useState(0);

    useEffect(() => {
        if (contentRef1.current) setHeight1(open1 ? contentRef1.current.scrollHeight : 0);
    }, [open1]);

    useEffect(() => {
        if (contentRef2.current) setHeight2(open2 ? contentRef2.current.scrollHeight : 0);
    }, [open2]);

    useEffect(() => {
        if (contentRef3.current) setHeight3(open3 ? contentRef3.current.scrollHeight : 0);
    }, [open3]);

    ///////BUBBLE FLOW

    const [activeStep01, setActiveStep01] = useState(0);
    const [activeStep02, setActiveStep02] = useState(0);
    const [activeStep03, setActiveStep03] = useState(0);


    const [answers, setAnswers] = useState<AnswersState>({
        // General questions
        expectMore: null,
        considerMeta: null,

        // MetaPart4 questions
        usesMeta: null,
        nativeLanguage: null,
        metaAccuracy: null,
        sliderValue: 0,

        // NewsScatter questions
        awareness: "",
        foreignWorkers: "",
        foreignWorkersPercent: 0,
        topNationalities: [],
        nationalitySearch: "",
    });

    const handleAnswer = <K extends keyof AnswersState>(
        key: K,
        value: AnswersState[K]
    ) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };


    const flowTexts01 = [
        `Procjena potencijalne publike na temelju Meta Ads Managera uzeta je kao <b>prosjek</b> raspona minimalne i maksimalne vrijednosti. <br/><br/>Pri odabiru lokacije, Meta procjenjuje korisnike koji provode vrijeme u Hrvatskoj, kao što su ljudi koji tu žive ili su nedavno tu bili.`,
        `Polazni kriterij za odabir jezika je MUP-ova lista top 10 stranih državljanstava.`,
        `Radi šire usporedbe i točnije procjene uključeni su hrvatski i engleski jezik, zatim službeni jezici susjednih i drugih europskih zemalja te svjetski jezici poput kineskog, japanskog itd. <br/><br/>Hrvatski i engleski su očekivano prepoznati kao najkorišteniji jezici u Hrvatskoj.`,
        `Drugi jezici iz indijske jezične skupine, kao što su urdu, telugu, marathi, tamilski, gudžaratski, kannada, malajalamski, pandžabi, asamski i odija, isključeni su jer je procijenjena publika prema Meta Ads Manageru bila manja od 1000 korisnika (eventualno nula). <br/><br/>Isto tako, europski jezici poput irskog, malteškog, islandskog, norveškog, finskog i estonskog te drugi jezici poput korejskog, farskog, kazahstanskog, tadžičkog također nisu prikazani zbog vrlo male procijenjene publike. <br/><br/>Crnogorski i romski nisu na listi jezika Ads Manager-a.`
    ];

    const flowTexts02 = [
        `Meta API podaci prikazuju procjene broja osoba koje su živjele u određenoj zemlji, odnosno na engleskom "Lived in ... (Formerly Expats)". 
        <br/><br/>Međutim, Meta ne nudi kategorije za sve zemlje. Npr. nema dostupne pretrage za npr. Bosnu i Hercegovinu, Makedoniju, Albaniju, Ukrajinu, Egipat, Tursku, Uzbekistan...`,
        `Također, nije poznato kako točno Meta razlikuje turista od iseljenika, npr. koliko dugo osoba treba boraviti u inozemstvu. <br/><br/>Ovi brojevi mogu uključivati i Hrvate koji su živjeli u inozemstvu i vratili se.
        <br/><br/>Prema Državnom zavodu za statistiku samo u 2024. je zabilježeno da je najviše Hrvata stiglo iz Njemačke (6336), Bosne i Hercegovine (1625), Austrije (1116) i Švicarske (611) te u manjoj mjeri uglavnom iz drugih europskih zemalja.`,
        `Osim hrvatskih državljana i stranih radnika, Meta broji i druge osobe na teritoriju Hrvatske, npr. državljane drugih zemalja EU, putnike, turiste, studente na razmjeni itd. 
        <br/><br/>U 2025. godini, međunarodna zaštita odobrena je ukupno 25 osoba. Od toga je 24 osoba dobilo azil: 10 dječaka 0-13 godina, 2 mladića 14-17 godina, 2 odrasla muškarca 18-34 godine i 3 muškarca 35-64 godine, 4 djevojčice 0-13 godina i 3 žene 18-34 godine. Jedan muškarac u dobi 14-17 godina dobio je supsidijarnu zaštitu.`,
        `Ukupno je tijekom 2025. godine podneseno 14 928 zahtjeva za međunarodnu zaštitu. Najviše je zahtjeva državljana Ruske Federacije (3 227), slijede Turska (2 597), Afganistan (1 365), Egipat (1 364) i Sirija (1 253). 
        <br/><br/>Među ostalim zemljama podrijetla ističu se Bangladeš (954), Pakistan (670), Palestina (527), Kina (485), Maroko (473) i Irak (282). Ostale zemlje s manjim brojem podnositelja zahtjeva uključuju Indiju (250), Nepal (210), Ganu (147), Iran (118), Šri Lanku (82), Sijeru Leone (78), Azerbajdžan (75), Jordan (69) i Alžir (53), dok su neke zemlje zastupljene s tek nekoliko osoba, poput Mjanmara, Ekvadora, Gruzije, Južnog Sudana, Turkmenistana, Gabona, Norveške, Kosova, Crne Gore, Dominikanske Republike i Nigera (po 1 osoba).`,
        `Ukrajinci nisu na listi tražitelja azila jer imaju pravo na privremenu zaštitu unutar EU, što im omogućava boravak bez pokretanja standardnog azilnog postupka.`,
        () => (
            <div className="">
                <p className="question">
                    Mislite li da su ove procjene korisnika društvenih mreža u Hrvatskoj više od službenih dozvola za rad i boravak?
                </p>
                <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <button
                        className={`card-btn ${answers.expectMore === "Meta" ? "active" : ""}`}
                        onClick={() => handleAnswer("expectMore", "Meta")}
                    >
                        Da, više je korisnika
                    </button>
                    <button
                        className={`card-btn ${answers.expectMore === "MUP" ? "active" : ""}`}
                        onClick={() => handleAnswer("expectMore", "MUP")}
                    >
                        Ne, više je dozvola
                    </button>
                </div>
            </div>
        )
    ];


    const flowTexts03 = [
        `Službene statistike obuhvaćaju dvije vrste evidencija: podatke Ministarstva unutarnjih poslova o izdanim dozvolama za boravak i rad strance koji nisu državljani EU, te podatke Državnog zavoda za statistiku o nacionalnim manjinama u Hrvatskoj. <br/><br/>S druge strane, prikazane su dvije vrste Meta procjena.`,
        `Pomoću Marketing API-ja procjenjena je publika, odnosno broj korisnika Meta aplikacija, prema jeziku. Važno je napomenuti da nije u potpunosti poznato kako algoritam klasificira ove korisnike. <br/><br/>Jezik koji Meta pripisuje korisniku nije nužno samo jezik koji je odabrao u postavkama, nego može biti i inferiran iz interakcija s određenim sadržajem, primjerice dijeljenjem objava koje su klasificirane kao "sadržaj na bosanskom jeziku". Zbog sličnosti balkanskih jezika, jezik može biti pogrešno klasificiran.`,
        `Uz to, prikazane su i Meta procjene za kategorije "iseljenika" (engl. expats), koje prikazuju broj korisnika koji su nekada živjeli u određenoj zemlji. <br/><br/>Ni u ovom slučaju nije poznato koje točno kriterije Meta primjenjuje da bi nekoga svrstala u ove kategorije.`,
        `Posebno je zanimljiva usporedba MUP-ovih podataka s Meta procjenama prema prošloj lokaciji (engl. expats), jer su vrijednosti relativno blizu, čak i u slučaju Srbije koja je susjedna zemlja. <br/><br/>Generalno, MUP-ova procjena je viša od Meta procjene prema prošloj lokaciji, što znači da Meta nije identificirala više migranata nego što ih evidencija bilježi.`,
        `U svakom slučaju, treba uzeti u obzir i vremensku razliku u mjerenju: Meta podaci prikupljeni su u veljači 2026. godine, a MUP-ovi u prosincu 2025. <br/><br/>Dodatno ograničenje predstavlja nedostupnost pretrage za Bosnu i Hercegovinu, Makedoniju, Kosovo, Egipat i Uzbekistan.`,
        `Ako usporedimo službene podatke s Meta procjenama prema jeziku, vidljive su regionalne razlike koje zahtijevaju pobližu analizu.`
    ];

    const flow01Ref = useRef<HTMLDivElement>(null);
    const flow02Ref = useRef<HTMLDivElement>(null);
    const flow03Ref = useRef<HTMLDivElement>(null);

    // Flow 01
    useEffect(() => {
        const observer1 = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const step = Number((entry.target as HTMLElement).dataset.step);
                        setActiveStep01(step);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll(".step-01").forEach(el => observer1.observe(el));

        return () => observer1.disconnect();
    }, []);

    // Flow 02
    useEffect(() => {
        const observer2 = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const step = Number((entry.target as HTMLElement).dataset.step);
                        setActiveStep02(step);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll(".step-02").forEach(el => observer2.observe(el));

        return () => observer2.disconnect();
    }, []);

    // Flow 03
    useEffect(() => {
        const observer3 = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const step = Number((entry.target as HTMLElement).dataset.step);
                        setActiveStep03(step);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll(".step-03").forEach(el => observer3.observe(el));

        return () => observer3.disconnect();
    }, []);


    return (

        <>
            <NewsScatter answers={answers} handleAnswer={handleAnswer} />

            <BiggerPicture />

            <HoverHighlight />

            <MetaPart4 answers={answers} handleAnswer={handleAnswer} />

            <div className="w-full max-w-4xl min-w-0 mx-auto px-5 mt-20 mb-30 text-gray-700   ">

                <p className=" text-xs tracking-[0.18em] uppercase text-[#c51b8a] font-semibold mb-7">
                    Procjena korisnika u Hrvatskoj
                </p>

                <h2 className="relative z-10  m-0">Koliko osoba u Hrvatskoj koristi Meta aplikacije?</h2>

                <p className="paragraph">
                    U svibnju 2025. u Hrvatskoj je procjenjeno <b>2 496 900 aktivnih korisnika Facebooka</b>, što je otprilike 65% ukupne populacije. To je u skladu s rasponom publike kojeg Meta Ads Manager daje u veljači 2026. (između 2 400 000 i 2 800 000 korisnika).
                    <br /><br />
                    Međutim, ako želimo preciznije targetirati koristeći više karakteristika, a ne samo lokaciju, stvari brzo postanu zamršene i važno je naglasiti da Meta procjene nisu nužno međusobno isključive.
                    <br /><br />Primjerice, jedna osoba istovremeno može biti uključena u procjene za više jezika, osobito ako govori više jezika ili ima postavke sučelja na jednom jeziku a komunicira na drugome. To znači da zbroj procjena po jezicima neće biti jednak ukupnom broju korisnika u Hrvatskoj.

                    <img
                        src="/ads_manager.png"
                        alt="Meta Ads Manager procjena korisnika u Hrvatskoj"
                        loading="lazy"
                        width="1200"
                        height="800"
                        className="w-full h-auto my-10"

                    />

                </p>

            </div>

            <div className="relative mb-20">

                <div className="sticky top-10">


                    <div className="relative mb-6 ">

                        <div className=" h-px border-t  border-gray-200" />

                        <span aria-hidden className="absolute top-0 -translate-x-1/10 right-0  text-[clamp(5rem,12vw,12rem)] font-black text-gray-100 leading-none whitespace-nowrap select-none pointer-events-none z-0 tracking-tight">
                            01
                        </span>

                    </div>

                    <div className="w-full max-w-4xl min-w-0 mx-auto px-5 mt-10 text-gray-700   ">

                        <p className=" text-xs tracking-[0.18em] uppercase text-[#c51b8a] font-semibold mt-10 mb-7">
                            Procjena korisnika prema jeziku
                        </p>

                        <h2 className="relative z-10  m-0">Procjena publike prema jeziku: Meta Ads Manager</h2>

                        <BubbleChart step={activeStep01} />

                        <div className="text-center text-sm text-gray-500 mt-2">
                            Podaci su prikupljeni u veljači 2026.
                        </div>

                    </div>

                </div>


                <div className="flex justify-center sm:justify-end  sm:pr-20">

                    <div ref={flow01Ref} className="w-80 h-auto gap-70 mt-10 mb-250  flex flex-col">

                        {flowTexts01.map((text, index) => {
                            const isActive = index === activeStep01;
                            return (
                                <div
                                    key={index}
                                    data-step={index}
                                    className={`step-01 bg-gray-100 p-6 rounded-xl shadow-md transition-all duration-1000 ease-out z-999
                          ${isActive ? "opacity-90 translate-x-0" : "opacity-0 translate-x-12"}`}
                                    dangerouslySetInnerHTML={{ __html: text }}
                                ></div>
                            );
                        })}

                    </div>
                </div>

            </div>

            <div className="relative mb-20">

                <div className="sticky top-10">

                    <div className="relative mb-6 ">

                        <div className=" h-px border-t  border-gray-200" />

                        <span aria-hidden className="absolute top-0 -translate-x-1/10 right-0  text-[clamp(5rem,12vw,12rem)] font-black text-gray-100 leading-none whitespace-nowrap select-none pointer-events-none z-[-10] tracking-tight">
                            02
                        </span>

                    </div>

                    <div className="w-full max-w-4xl min-w-0 mx-auto px-5 mt-10  text-gray-700   ">

                        <p className=" text-xs tracking-[0.18em] uppercase text-[#c51b8a] font-semibold mt-10 mb-7 z-10">
                            Procjena korisnika prema prošloj lokaciji
                        </p>

                        <h2 className="relative z-10  m-0">Procjena publike prema prošloj lokaciji: Meta API</h2>

                    </div>

                    <section className="w-full min-w-0 max-w-6xl mx-auto h-auto pl-10 pr-5 mb-20  ">

                        <ExpatBars />

                    </section>

                </div>


                <div className="flex justify-center sm:justify-end  sm:pr-20">

                    <div ref={flow02Ref} className="w-80 h-auto gap-70 mt-10 mb-100  flex flex-col">

                        {flowTexts02.map((item, index) => {
                            const isActive = index === activeStep02;
                            return (
                                <div
                                    key={index}
                                    data-step={index}
                                    className={`step-02 bg-gray-100 p-6 rounded-xl shadow-md transition-all duration-1000 ease-out z-999
        ${isActive ? "opacity-90 translate-x-0" : "opacity-0 translate-x-12"}`}
                                >
                                    {typeof item === "string" ? (
                                        <div dangerouslySetInnerHTML={{ __html: item }} />
                                    ) : (
                                        <>{item()}</> // properly call the JSX function
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>


            <div className="relative mb-20">

                <div className="sticky top-10">

                    <div className="w-full mt-20 lg:mb-5 pt-5 bg-gray-50 flex flex-col justify-center  ">

                        <div className="w-full max-w-4xl min-w-0 mx-auto px-5">

                            <p className="text-xs tracking-[0.18em] uppercase text-[#c51b8a] font-semibold mt-5 ">
                                Usporedba službenih podataka s Meta procjenama
                            </p>
                            <h2 className="relative mt-5 !mb-10">Je li digitalni trag ogledalo službenih statistika?</h2>

                        </div>
                    </div>

                    <div className="w-full min-w-0 max-w-6xl mx-auto h-auto pl-10 pr-5 ">

                        <MetaChart />

                    </div>

                </div >

                <div className="flex justify-center sm:justify-end sm:pr-20">
                    <div ref={flow03Ref} className="w-80 h-auto gap-70 mt-10 mb-250 flex flex-col">
                        {flowTexts03.map((text, index) => {
                            const isActive = index === activeStep01;
                            return (
                                <div
                                    key={index}
                                    data-step={index}
                                    className={`step-01 bg-gray-100 p-6 rounded-xl shadow-md transition-all duration-1000 ease-out z-999
                          ${isActive ? "opacity-90 translate-x-0" : "opacity-0 translate-x-12"}`}
                                    dangerouslySetInnerHTML={{ __html: text }}
                                ></div>
                            );
                        })}
                    </div>
                </div>

            </div >





            <div className="w-full max-w-4xl min-w-0 px-5 mt-20 text-gray-700  mx-auto  ">

                <Rezultati />

                <Objasnjenja />

                <div className="space-y-2">

                    <button
                        onClick={() => setOpen1(!open1)}
                        className="flex items-center text-start gap-2 text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-lg w-full justify-between"
                    >
                        Broji li Meta korisnike WhatsApp-a kao publiku?
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${open1 ? "rotate-180" : ""}`}
                        />
                    </button>
                    <div
                        ref={contentRef1}
                        style={{ maxHeight: `${height1}px` }}
                        className="overflow-hidden transition-max-height duration-300 ease-in-out"
                    >
                        <div className=" p-5 pb-15">

                            <div className="flex flex-col md:flex-row w-full md:max-h-125 gap-3 mb-10 pr-5">

                                <p className="paragraph  md:pr-10">
                                    Iako je <b>WhatsApp</b> u Meta vlasništvu, vjerojatno nije uključen u procjene ako korisnik ne koristi druge aplikacije jer Meta u Hrvatskoj zasad ne može prikazivati oglase na WhatsApp-u, što će se uskoro promijeniti.
                                    <br /><br />
                                    Meta je u procesu lansiranja WhatsApp Business API-ja diljem svijeta, te je najavila da će koristiti lokaciju korisnika, jezik i podatke s Instagrama i Facebooka za prilagođavanje oglasa na WhatsAppu.
                                    <br /><br />Međutim, Europska komisija nedavno je formalno odredila WhatsApp kao Vrlo veliku online platformu (VLOP) prema Zakonu o digitalnim uslugama (DSA) te je postavljen rok do sredine svibnja 2026. da se WhatsApp uskladi s pravilima Europske unije namijenjenim <b>zaštiti privatnosti korisnika</b>. Ovaj potez dio je pojačanog regulatornog pritiska EU protiv glavnih američkih tehnoloških platformi. Administracija američkog predsjednika Donalda Trumpa prethodno je aspekte DSA označila kao "cenzuru" i potencijalno diskriminirajući tretman američkih tvrtki.
                                </p>

                                <img
                                    src="/meta-oglasi.jfif"
                                    alt="Meta AI"
                                    loading="lazy"
                                    className="w-9/10 mx-auto md:w-3/11 h-auto rounded-2xl border-4"
                                />


                            </div>

                        </div>
                    </div>

                    <button
                        onClick={() => setOpen2(!open2)}
                        className="flex items-center gap-2 text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-lg w-full justify-between"
                    >
                        Nudi li Meta enkripciju?
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${open2 ? "rotate-180" : ""}`}
                        />
                    </button>
                    <div
                        ref={contentRef2}
                        style={{ maxHeight: `${height2}px` }}
                        className="overflow-hidden transition-max-height duration-300 ease-in-out"
                    >
                        <div className=" p-5 ">
                            <p className="paragraph">
                                Meta je u prosincu 2023. godine počela uvođenje <b>end-to-end enkripcije</b> (E2EE) kao zadane postavke za privatne razgovore na Messengeru i Facebooku. Ovaj postupak osigurava da samo pošiljatelj i primatelj mogu razumjeti sadržaj poruke. Međutim, postoji ključna razlika između enkripcije na WhatsAppu i Messengeru. <b>WhatsApp čuva enkriptirane backupe u cloudu</b> (iCloud/Google Drive) s ključem koji poznaje samo korisnik, dakle niti WhatsApp ni cloud provider ne mogu ih dešifrirati. <b>Messenger čuva enkriptirane sigurnosne kopije poruka na Meta serverima</b> kako bi korisnici mogli pristupiti svojim porukama s bilo kojeg uređaja. Iako Meta ne može dešifrirati te sigurnosne kopije, ova metoda narušava "savršenu tajnost" (perfect forward secrecy), sigurnosnu značajku koja sprječava dešifriranje svih poruka ako se postigne pristup jednoj poruci.
                            </p>

                            <div className="-lg my-4">
                                <ul className="space-y-2">
                                    <li><b>WhatsApp razgovori</b>: E2EE zadano od 2016. godine</li>
                                    <li><b>Messenger (1-na-1 razgovori)</b>: E2EE zadano od prosinca 2023.</li>
                                    <li><b>Instagram Direct Messages</b>: E2EE u postupnom uvođenju</li>
                                    <li><b>Facebook grupe, Marketplace, objave i slično</b>: Nisu enkriptirani</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen3(!open3)}
                        className="flex items-center gap-2 text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-lg w-full justify-between"
                    >
                        Dijeli li Meta podatke s vladama?
                        <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${open3 ? "rotate-180" : ""}`}
                        />
                    </button>
                    <div
                        ref={contentRef3}
                        style={{ maxHeight: `${height3}px` }}
                        className="overflow-hidden transition-max-height duration-300 ease-in-out"
                    >
                        <div className="p-5 ">
                            <p className="paragraph">
                                Meta dijeli korisničke podatke s vladinim agencijama diljem svijeta kao odgovor na službene zahtjeve u okviru zakona. Ovisno o zahtjevu, Meta može dijeliti kreditne kartice, adrese e-pošte, IP adrese prijave/odjave, poruke, fotografije, videozapise, objave na vremenskoj crti i informacije o lokaciji. Samo u prvoj polovici 2025. zabilježeno je <b>374 516 zahtjeva</b> od vlada iz 136 zemalja, obuhvaćajući preko <b>700 000 korisničkih računa</b>. Meta je pristala na <b>79% svih zahtjeva</b>. Broj zahtjeva diljem svijeta raste, a najviše podataka traže <b>Indija</b> (136 000), <b>SAD</b> (81 100), <b>Brazil</b> (30 900), <b>Njemačka</b> (24 700), <b>Francuska</b> (16 100), <b>Ujedinjeno Kraljevstvo</b> (11 500), <b>Poljska</b> (8 930), <b>Meksiko</b> (5 880), <b>Tajvan</b> (4 960) i <b>Španjolska</b> (4 070).
                                <br /><span> Izvor:{" "}
                                    <a href="https://transparency.meta.com/reports/government-data-requests/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Meta Zahtjevi vlade za korisničke podatke</a>
                                </span>

                            </p>

                            <img
                                src="/meta-global.png"
                                alt="Meta Global"
                                loading="lazy"
                                className="w-full h-auto my-10"
                            />

                            <p className="paragraph">
                                Najnovije izvješće o transparentnosti otkriva razlike u zahtjevima  među regijama, ističući neke obrasce, ali i značajna odstupanja u strategijama vladinih zahtjeva za podacima, stopama uspjeha i pravnim okvirima.
                                Primjerice, ističe se <b>Tajvan </b>(11 500 korisnika) sa stopom učinkovitosti od čak 95%i visokim brojem zahtjeva po glavi stanovnika, što odražava precizno ciljanje i snažnu pravnu jasnoću u vladinim zahtjevima.
                                <b> SAD</b> (150 000 korisnika) ima umjerenu stopu zahtjeva po glavi stanovnika, ali vrlo velik broj ukupnih zahtjeva i visoku stopu uspjeha (88%).
                                S druge strane, <b>Meksiko</b> (11 700 korisnika) ima relativno nisku stopu uspjeha (55%) što ukazuje na manje precizne zahtjeve ili strukturne izazove u dobivanju podataka.
                                <b> Indija</b> (246 000 korisnika) i <b>Brazil</b> (112 000 korisnika) imaju ogromne populacije, ali relativno malo zahtjeva po glavi stanovnika.
                                <b> Njemačka</b> (39 700 korisnika), <b>Francuska</b> (18 400 korisnika) i <b>Ujedinjeno Kraljevstvo</b> (14 400 korisnika) imaju umjerene razine zahtjeva po glavi stanovnika, ali visoke stope uspjeha. Francuska pokazuje neobičan obrazac, jer hitni zahtjevi premašuju formalne pravne.</p>


                            <p className="paragraph"><b>Hrvatska</b> je u 2025. bila na 52. mjestu prema ukupnom broju zahtjeva (141), uključujući 228 korisnika, a na 13. mjestu prema postotku odobrenih zahtjeva (84%). Podaci za Hrvatsku:</p>

                            <img
                                src="/meta-cro-type.png"
                                alt="Meta Croatia"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                            />

                        </div>
                    </div>
                </div>

                <div className="my-50">
                    <div>
                        <p className="question">
                            Ako Meta pokaže rast ili smanjenje neke skupine, mislite li da je to dobar indikator stvarnih promjena u društvu?
                        </p>
                        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                            <button
                                className={`card-btn ${answers.considerMeta === "Da" ? "active" : ""}`}
                                onClick={() => handleAnswer("considerMeta", "Da")}
                            >
                                Da, svakako
                            </button>
                            <button
                                className={`card-btn ${answers.considerMeta === "Oprezno" ? "active" : ""}`}
                                onClick={() => handleAnswer("considerMeta", "Oprezno")}
                            >
                                Da, ali uz oprez
                            </button>
                            <button
                                className={`card-btn ${answers.considerMeta === "Ne" ? "active" : ""}`}
                                onClick={() => handleAnswer("considerMeta", "Ne")}
                            >
                                Ne, nikako
                            </button>
                        </div>
                    </div>


                    <SeeSummary
                        answers={answers}
                        sessionId={sessionId}
                        isLoading={isLoading}
                        hasSubmitted={hasSubmitted}
                        onSubmit={handleSeeSummary} // triggers upsert + fetch
                    />


                </div>


                {/*
                <section className="section mt-20" >

                    <h2>Razlike u procjenama Meta Ads Managera-a i Graph API-ja</h2>

                    <p className="paragraph ">
                        U nekim znanstvenim radovima navodi se da <b>procjene publike dobivene putem API-ja mogu biti preciznije</b> (u manjim rasponima) nego one koje se prikazuju u sučelju Ads Managera.
                        Također, korisnici često prijavljuju da Ads Manager prikazuje &lt;1000 ili jako malu publiku iako stvarni promet ili podaci pokazuju daleko veće brojeve, što može biti rezultat Meta ograničenja ili načina prikaza procjena.
                        Pretpostavlja se da Meta namjerno ograničava procjenu publike radi privatnosti korisnika ili vlastitih strategija.
                        Međutim, u ovoj analizi procjene Ads Managera i Graph API-ja pokazuju dobro slaganje, vjerojatno zato što su korišteni relativno jednostavni kriteriji (geografska lokacija i jezik) bez dodatnih demografskih filtera koji mogu uzrokovati veća odstupanja.

                    </p>

                    <MetaContainer />

                    <p className="paragraph mt-15">
                        Povezanost Meta procjena s MUP-ovim podacima je <b>umjerena i ukazuje na dva suprotna trenda</b> koji utječu na koeficijent korelacije (r=0.66). S jedne strane, Meta procjene prepoznaju zznatno veću aktivnost govornika jezika susjednih zemalja nego što to sugeriraju MUP-ove dozvole za boravak i rad (odstupanja iznad crvene regresijske linije). Suprotna situacija vrijedi za azijske zajednice, pri čemu se čini da Meta podcjenjuje stvaran broj govornika (odstupanja ispod crvene regresijske linije), najvjerojatnije zato što te osobe Facebook koriste na engleskom jeziku, čime postaju nevidljive za procjene temeljene na jezičnim postavkama.
                    </p>

                    <p className="paragraph ">
                        Podaci za rusku i ukrajinsku zajednicu nisu dostupni u MUP-ovim evidencijama te su izostavljeni iz korelacijske analize, no Meta procjenjuje oko 15 500 govornika ruskog i 8 500 govornika ukrajinskog jezika u Hrvatskoj, što upućuje na prisutnost ovih zajednica koja nije obuhvaćena službenim statistikama.

                    </p>

                </section>

*/}
            </div>


            <div className="w-full bg-gray-50 flex flex-col justify-center py-10 my-20">

                <div className="w-full max-w-4xl min-w-0 mx-auto px-5">

                    <p className="text-xs tracking-[0.18em] uppercase text-[#c51b8a] font-semibold mt-5 ">
                        Potencijali i ograničenja
                    </p>
                    <h2 className="relative mt-5 ">Digitalni trag daje širu sliku i može signalizirati promjene</h2>

                    <p className="paragraph  ">
                        Možemo li dakle koristiti Meta procjene za provjeru službenih podataka? Odgovor je — donekle, ali ne u potpunosti. Ova analiza pokazuje da <b>Meta podaci mogu biti koristan dopunski izvor</b>, ali ne mogu zamijeniti službene evidencije.
                        <br /><br />
                        Razlike su očekivane i nastaju jer Meta i službene institucije mjere različite stvari. Također, postoje i vremenske razlike u mjerenju. Međutim, procjene prema prošloj lokaciji (engl. expats) za dostupne zemlje prate podatke službene evidencije, što potvrđuje MUP-ove podatke i sugerira da digitalni trag može odražavati stvarne demografske obrasce. Posebno je značajna procjena broja govornika bengalskog koja potvrđuje MUP-ove podatke. Pretpostavlja se da MUP i Meta pokazuju približno iste podatke pod uvjetom da skupina dominantno koristi Meta platformu i pretežno koristi svoj materinski jezik na Meta platformama, te nema prekograničnog kretanja.
                        <br /><br />
                        Odstupanja kod balkanskih i azijskih skupina nisu nužno greška već odraz <b>različite metodologije, geografske blizine, jezičnih karakteristika i različitih ponašanja, kao što su interakcije sa različitim jezičnim sadržajem, putovanja i izbor platformi</b>. Meta u svoju procjenu uključuje samo svoje korisnike, bez obzira jesu li to prekogranični putnici, sezonski radnici ili turisti, dok MUP pokazuje broj osoba prema državljanstvu s dozvolom za rad i boravak unutar države.
                        <br /><br />Potencijalna objašnjenja trebalo bi dodatno ispitati, primjerice anketiranjem o korištenju društvenih mreža i jezičnim postavkama. Možda je bolje pitanje što nam mogu reći promjene u procjenama i mogu li nas upozoriti kada se nešto mijenja, prije nego što službena statistika to potvrdi.

                    </p>
                </div>
            </div>

            <div className="w-full max-w-4xl min-w-0 px-5  text-gray-700  mx-auto  ">

                <p className=" text-gray-500 text-sm text-justify">
                    Ova analiza bavi se područjem digitalne demografije te istražuje potencijal i ograničenja komercijalnih platformskih podataka kao komplementarnog izvora za proučavanje migracijskih trendova. Vizualizacije služe samo u obrazovne i istraživačke svrhe.
                    Prikazani podaci su agregirani i ne sadrže osobne ili identificirajuće informacije.
                    Prikazani uvidi služe analitičkoj demonstraciji i nisu namijenjeni komercijalnoj upotrebi.
                </p>

                <div className=" h-px my-10 border-t  border-gray-300" />


                <p className=" text-xs tracking-[0.18em] uppercase text-[#c51b8a] font-semibold mb-4">
                    Reference
                </p>

                <ul className=" flex flex-col gap-3 mx-auto ">
                    <li>
                        <a href="https://www.researchgate.net/figure/Part-of-a-screenshot-of-Facebooks-Adverts-Manager-illustrating-some-of-the-targeting_fig1_324069454"
                            target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] text-[#c51b8a]  decoration-pink-300">
                            Mejova, Weber i Fernandez-Luque (2018). Online Health Monitoring using Facebook Advertisement Audience Estimates in the United States: Evaluation Study
                        </a>
                    </li>

                    <li>
                        <a href="https://stats.napoleoncat.com/facebook-users-in-croatia/2025/05/"
                            target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] text-[#c51b8a]  decoration-pink-300">
                            NapoleonCat: Facebook users in Croatia, May 2025
                        </a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com/business/help/1665333080167380?id=176276233019487"
                            target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] text-[#c51b8a]  decoration-pink-300">
                            Meta: About Estimated Audience Size
                        </a>
                    </li>

                    <li>
                        <a href="https://transparency.meta.com/reports/government-data-requests/country/HR/"
                            target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] text-[#c51b8a]  decoration-pink-300">
                            Meta: Government Requests for User Data Croatia
                        </a>
                    </li>
                    <li>
                        <a href="https://mup.gov.hr/gradjani-281562/moji-dokumenti-281563/stranci-333/statistika-169019/169019"
                            target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] text-[#c51b8a]  decoration-pink-300">
                            MUP: Statistički podaci izdanih dozvola za boravak i rad od 1. siječnja do 31. prosinca 2025. godine
                        </a>
                    </li>
                    <li>
                        <a href="https://mup.gov.hr/pristup-informacijama-16/statistika-228/statistika-trazitelji-medjunarodne-zastite/283234"
                            target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] text-[#c51b8a]  decoration-pink-300">
                            MUP: Statistika: Tražitelji međunarodne zaštite
                        </a>
                    </li>
                </ul>




            </div >



        </>
    );
}
