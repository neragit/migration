"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"



type Section = {
    id: number
    heading: string
    number: string
    color?: string
    content: React.ReactNode
}

type Group = {
    id: number
    label: string
    color?: string
    sections: Section[]

}

/* ===============================
   DATA STRUCTURE (SCALABLE)
=================================*/

const groups: Group[] = [
    {
        id: 0,
        label: "Balkanski jezici",
        color: "[#1976D2]",
        sections: [
            {
                id: 1,
                heading: "Kratkotrajna putovanja preko granice",
                number: "1",
                color: "[#1976D2]",
                content: (
                    <> Govornici bosanskog, srpskog i makedonskog jezika mogu slobodno putovati unutar EU bez boravišnih dozvola. Meta bilježi aktivnost uređaja u Hrvatskoj (uključujući posjetitelje), dok MUP broji samo stanovnike. To povećava Meta procjene za balkanske jezike.</>
                ),
            },
            {
                id: 2,
                heading: "Problemi klasifikacije jezika",
                number: "2",
                color: "[#1976D2]",
                content: <>Hrvatski, bosanski, srpski i crnogorski međusobno međusobno su razumljivi. Zbog <b>sličnosti među balkanskim jezicima i  razlikama među dijalektima</b>, moguće je da dolazi do pogrešne klasifikacije. Npr. ikavica i ekavica u odnosu na ijekavicu. Međutim, Meta detektira jezik prvenstveno prema postavkama sučelja (koje korisnik može konfigurirati) pa bi se očekivalo da je procjena u skladu s govornim jezikom.</>,
            },
            {
                id: 3,
                heading: "Crnogorski nije na listi",
                number: "3",
                color: "[#1976D2]",
                content: <>S obzirom da Meta <b>ne prepoznaje crnogorski jezik</b>, ova je skupina sigurno ubrojena u jedan od ostalih jezika, najvjerojatnije bosanski ili srpski. Nažalost MUP nije objavio podatke za Crnu Goru jer nije u top 10 državljanstava u Hrvatskoj, pa se može samo pretpostaviti da je taj broj ispod 3 400.</>,
            },
            {
                id: 4,
                heading: "Albanski jezik u Kosovu",
                number: "4",
                color: "[#1976D2]",
                content: <>Budući da <b>većina stanovništva Kosova koristi albanski jezik</b>, u analizi su podaci za Kosovo (MUP) upareni s albanskim jezikom (Meta). Time bi se moglo objasniti zašto Meta precijenjuje Kosovo - zapravo broji sve albanske govornike, uključujući Albaniju. Slično kao za Crnu Goru, MUP nije objavio podatke za Albaniju pa se može samo pretpostaviti da je taj broj ispod 3 400. To bi djelomično objasnilo razliku od 5 495.</>,
            },
        ],
    },

    {
        id: 1,
        label: "Daleka Azija",
        color: "[#FDAE6B]",
        sections: [
            {
                id: 1,
                heading: "Engleski kao svjetski jezik",
                number: "1",
                color: "[#FDAE6B]",
                content: <>Engleski se koristi kao <b>drugi službeni jezik u Filipinima i Indiji</b>. Azijske migrantske skupine (indijske, filipinske, nepalske) često govore engleski i moguće je da koriste englesko sučelje na Meta platformama. U tom slučaju ih Meta može kategorizirati kao govornike engleskog, dok ih MUP broji prema državljanstvu bez obzira na jezik.
                    <br /><br />
                    Također, što se tiče Filipina, treba uzeti u obzir i korištenje Cebuano jezika koji je prepoznat u značajnom broju pomoću Meta Ads Managera. Otprilike 1 200 govornika djelomično objašnjava razliku od 3 629.
                </>,
            },
            {
                id: 2,
                heading: "Vremenske promjene",
                number: "2",
                color: "[#FDAE6B]",
                content: <>S obzirom da su navedeni MUP-ovi podaci iz prosinca 2025. a Meta prikazuje aktualne podatke u veljači 2026. <b>moguće je da se broj stranaca iz azijskih zemalja u međuvremenu smanjio</b>.</>,
            },
            {
                id: 3,
                heading: "Preferencije aplikacija",
                number: "3",
                color: "[#FDAE6B]",
                content: <>Jedno od objašnjenja manjeg broja veličine publike azijskog podrijetla u Hrvatskoj može biti <b>manje korištenje ovih društvenih mreža</b>. Moguće ja da ove populacije preferiraju Tik Tok, Snapchat, X (Twitter), Telegram ili druge aplikacije. Međutim, u svim navedenim zemljama Meta aplikacije su među najpopularnijima, osim u Uzbekistanu.</>,
            },
        ],
    },

    {
        id: 2,
        label: "Egipat",
        color: "[#1976D2]",
        sections: [
            {
                id: 1,
                heading: "Rasprostranjenost arapskog jezika",
                number: "1",
                color: "[#1976D2]",
                content: <>Meta vjerojatno "precijenjuje" Egipat jer se <b>arapski jezik koristi u brojnim zemljama Bliskog istoka i Sjeverne Afrike</b>, što može dovesti do uključivanja drugih arapskih govornika u Hrvatskoj koji nisu na MUP-ovoj listi top 10 (Sirija, Jordan, Palestina, itd.). Isto tako, Meta vjerojatno broji i turiste iz arapskih zemalja koji trenutno borave u Hrvatskoj. U svakom slučaju radi se o relativno maloj razlici od svega 1 146 i treba uzeti u obzir da Meta daje procjenu u rasponu, a ovdje je korišten prosjek te procjene pa može doći do malog odstupanja.</>,
            },
        ],
    },

    {
        id: 3,
        label: "Bangladeš",
        color: "[#FDAE6B]",
        sections: [
            {
                id: 1,
                heading: "Bangladeš kao kontrolna skupina",
                number: "1",
                color: "[#FDAE6B]",
                content: <>Na temelju vidljivih rezultata i dodatnog konteksta, Bangladeš se može uzeti kao kontrolna skupina koja potvrđuje točnost Meta procjena kada su ispunjeni <b>sljedeći uvjeti:</b>

                    < div className="p-5">
                        <li> Minimalna jezična konfuzija (bengalski je specifičan jezik)</li>
                        <li> Niska razina poznavanja engleskog jezika</li>
                        <li> Značajno korištenje Meta aplikacija u odnosu na ostale opcije</li>
                        <li> Nema kratkotrajnog prekograničnog kretanja s Hrvatskom kao kod susjednih zemalja</li>
                        <li> Stroža kontrola</li>

                    </div>

                </>,
            },
            {
                id: 2,
                heading: "Stroža kontrola",
                number: "2",
                color: "[#FDAE6B]",
                content: <>Početkom 2025. ustanovljeno je kako su državljani Bangladeša prepoznati kao <b>visoko rizična migracijska skupina</b> zbog učestalih zlouporaba hrvatskih viza D. Primijetilo se kako se prilikom tranzita u zračnim lukama u drugim državama članicama, nakon obavljene schengenske granične kontrole ovi državljani ostaju u drugim državama članicama EU, dok u Hrvatsku stiže samo njihova lažna prtljaga. Iz tog razloga, MUP je najavio <b>dodatne provjere prije izdavanja novih dozvola</b>. Iako se najviše spominjalo državljane Bangladeša, MUP je obavijestio dodatne provjere za državljane svih zemalja. Ovi rezultati sugeriraju da je za državljane Bangladeša stvarno i provedena stroža kontrola.</>,
            },
        ],
    },

    {
        id: 4,
        label: "Uzbekistan",
        color: "[#555]",
        sections: [
            {
                id: 1,
                heading: "Drugačije digitalne navike",
                number: "1",
                color: "[#555]",
                content: <><b>U Uzbekistanu preko 70% populacije koristi Telegram</b> zbog povijesnog konteksta cenzure i nadzora. Telegram funkcionira ne samo kao privatni messenger već i kao primarna platforma za vijesti u <b>Srednjoj Aziji</b>, s tisućama kanala koji prenose sve od vladinih objava do komentara građana. Za razliku od Facebooka, Instagrama i drugih platformi koje su često bile blokirane, Telegram je postao <b>toliko integriran u uzbekistansko društvo da ga čak ni vlada ne može trajno blokirati</b>. Pokušaj blokade u studenom 2021. trajao je samo nekoliko sati prije nego što je predsjednik morao ponovno omogućiti pristup.
                    Meta nije pristala pohraniti podatke lokalno u Uzbekistanu, što je dovelo do blokada od 2021. do 2022. Telegram je toliko proširen i dugo percipiran kao najsigurnija opcija, da se njegova popularnost održala i nakon što je 2024. uhićen osnivač Pavel Durov zbog nesuradnje s vlastima u istragama kriminala na platformi, kada se promijenila Telegramova politika privatnosti te je od tada značajno porasla suradnja s vlastima. <br /><br />Ako uzbečki migranti u Hrvatskoj koriste Telegram, i eventualno dodaju WhatsApp za europsku integraciju, ali rijetko usvajaju Facebook/Instagram kao primarne platforme, to može objasniti značajno "podcjenjivanje".</>,
            },
            {
                id: 2,
                heading: "Korištenje ruskog jezika",
                number: "2",
                color: "[#555]",
                content: <>Uzbekistan je bio dio Sovjetskog Saveza od 1924. do 1991. godine, te je ruski bio obavezan jezik koji je do danas u upotrebi. Time bi se mogla djelomično objasniti ova razlika. Međutim, danas sve manje Uzbekistanaca aktivno koristi ruski, posebno mlađe generacije i ruralna populacija. Stoga je ovo objašnjenje manje vjerojatno ako su uzbečki migrati nižeg obrazovanja.</>,
            },
        ],
    },
]

/* ===============================
   COMPONENT
=================================*/

export default function Objasnjenja() {
    const [activeGroup, setActiveGroup] = useState(0)
    const [activeSection, setActiveSection] = useState(0)

    const groupRefs = useRef<(HTMLButtonElement | null)[]>([] as (HTMLButtonElement | null)[])
    const sectionRefs = useRef<(HTMLButtonElement | null)[]>([] as (HTMLButtonElement | null)[])


    const currentSections = groups[activeGroup].sections

    // Reset section when group changes
    useEffect(() => {
        setActiveSection(0)
    }, [activeGroup])

    /* ===== Keyboard Nav (Reusable) ===== */

    const handleKeyNav = (
        e: React.KeyboardEvent,
        index: number,
        length: number,
        setter: (i: number) => void,
        refs: React.MutableRefObject<(HTMLButtonElement | null)[]>
    ) => {
        let newIndex = index

        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                newIndex = (index + 1) % length
                break
            case "ArrowLeft":
            case "ArrowUp":
                newIndex = (index - 1 + length) % length
                break
            case "Home":
                newIndex = 0
                break
            case "End":
                newIndex = length - 1
                break
            case "Enter":
            case " ":
                setter(index)
                return
            default:
                return
        }

        e.preventDefault()
        refs.current[newIndex]?.focus()
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            <h2 className="text-lg font-semibold text-gray-700 md:pb-10">
                Što može objasniti ove razlike?
            </h2>

            {/* ===============================
          TOP GROUP BUTTONS
      =================================*/}
            <div
                role="tablist"
                className="flex flex-wrap gap-3 mb-12 justify-center lg:justify-normal lg:ml-60"
            >

                {groups.map((group, index) => (
                    <button
                        key={group.id}
                        ref={(el: HTMLButtonElement | null) => {
                            groupRefs.current[index] = el
                        }}
                        role="tab"
                        aria-selected={activeGroup === index}
                        tabIndex={activeGroup === index ? 0 : -1}
                        onClick={() => setActiveGroup(index)}
                        onKeyDown={(e) =>
                            handleKeyNav(e, index, groups.length, setActiveGroup, groupRefs)
                        }
                        style={
                            activeGroup === index
                                ? { backgroundColor: group?.color?.replace(/\[|\]/g, ""), color: "white" }
                                : undefined
                        }
                        className="px-5 py-2 rounded-lg text-sm font-medium transition
    bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700"
                    >
                        {group.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* ===============================
            SIDEBAR SECTIONS
        =================================*/}
                <aside className="lg:col-span-1">

                    <div role="tablist" className="space-y-2 ">
                        {currentSections.map((section, index) => (
                            <button
                                key={section.id}
                                ref={(el: HTMLButtonElement | null) => {
                                    sectionRefs.current[index] = el
                                }}
                                role="tab"
                                aria-selected={activeSection === index}
                                tabIndex={activeSection === index ? 0 : -1}
                                onClick={() => setActiveSection(index)}
                                onKeyDown={(e) =>
                                    handleKeyNav(
                                        e,
                                        index,
                                        currentSections.length,
                                        setActiveSection,
                                        sectionRefs
                                    )
                                }
                                className={`w-full flex items-center justify-between px-5 py-3 rounded-lg hover:cursor-pointer
                  ${activeSection === index
                                        ? `bg-gray-100 text-gray-700 `
                                        : "hover:bg-gray-50  text-gray-700"
                                    }`}
                            >
                                <span className="font-medium text-left pr-2">
                                    {section.heading}
                                </span>
                                <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ===============================
            CONTENT PANEL (FADE)
        =================================*/}

                <main
                    className={`lg:col-span-3 relative ${(activeGroup === 4 && activeSection === 0) ? "min-h-175 md:min-h-125" : "min-h-125"
                        }`}
                >
                {currentSections.map((section, index) => (
                    <section
                        key={section.id}
                        className={`absolute inset-0 
                ${activeSection === index
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4 pointer-events-none"
                            }`}
                    >
                        <span
                            className="absolute right-0 top-1/2 -translate-y-2/2  text-gray-300 text-[15rem] font-extrabold opacity-20 select-none pointer-events-none z-0"
                        >
                            {section.number}
                        </span>

                        {/* CONTENT */}
                        <div className="relative z-10  ">
                            <h3 className={`text-xl sm:text-2xl font-bold text-${section.color} text-left `}>
                                {section.heading}
                            </h3>


                            <div className="mt-6 text-gray-700 leading-relaxed text-justify">
                                {section.content}
                            </div>
                        </div>
                    </section>
                ))}
            </main>

        </div>
        </div >
    )
}
