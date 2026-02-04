"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import * as topojson from "topojson-client"


const ALL_COUNTIES_OCCUPATIONS = [
    "Programer/programerka",
    "Dizajner/dizajnerica korisničkog sučelja",
    "Sistemski administrator/sistemska administratorica",
    "Kuhar/kuharica nacionalne kuhinje",
    "Slastičar/slastičarka",
    "Pekar/pekarica",
    "Mesar/mesarica",
    "Krojač/krojačica",
    "Kožarski radnik/kožarska radnica",
    "Zidar/zidarica",
    "Tesar/tesarica",
    "Armirač/armiračica i betonirac/betonirka",
    "Zavarivač/zavarivačica",
    "Fasader/fasaderka",
    "Monter/monterka građevinskih elemenata",
    "Rukovatelj/rukovateljica građevinskim strojevima",
    "Klesar/klesarica",
    "Rukovatelj/rukovateljica kranom",
    "Stolar/stolarica",
    "Radnik/radnica visokogradnje",
    "Radnik/radnica niskogradnje",
    "Monter/monterka čelične užadi (dizalica i liftova)",
    "Monter/monterka cjevovoda",
    "Monter/monterka metalnih konstrukcija",
    "Soboslikar-ličilac/soboslikarica-ličiteljica",
    "Krovopokrivač/krovopokrivačica",
    "Vodoinstalater/vodoinstalaterka",
    "Elektroinstalater/elektroinstalaterka",
    "Instalater/instalaterka grijanja i klimatizacije",
    "Izolater/izolaterka",
    "Polagač/polagačica keramičkih pločica",
    "Podopolagač/podopolagačica",
    "Limar/limarica",
    "Bravar/bravarica",
    "Elektromonter/elektromonterka",
    "Električar/električarka",
    "Vozač/vozačica teretnog vozila",
    "Vozač/vozačica teretnog vozila s prikolicom",
    "Automehaničar/automehaničarka",
    "Autolakirer/autolakirerica",
    "Autolimar/autolimarica",
]

const OCCUPATIONS_BY_COUNTY: Record<string, string[]> = {
    "Konobar/konobarica": [
        "ISTARSKA",
        "PRIMORSKO-GORANSKA",
        "ZADARSKA",
        "LIČKO-SENJSKA",
        "ŠIBENSKO-KNINSKA",
        "SPLITSKO-DALMATINSKA",
        "DUBROVAČKO-NERETVANSKA",
        "GRAD ZAGREB",
        "ZAGREBAČKA",
        "MEĐIMURSKA",
        "KRAPINSKO-ZAGORSKA",
        "VARAŽDINSKA",
    ],
    "Kuhar/kuharica": [
        "ISTARSKA",
        "PRIMORSKO-GORANSKA",
        "ZADARSKA",
        "LIČKO-SENJSKA",
        "ŠIBENSKO-KNINSKA",
        "SPLITSKO-DALMATINSKA",
        "DUBROVAČKO-NERETVANSKA",
        "GRAD ZAGREB",
        "ZAGREBAČKA",
        "MEĐIMURSKA",
        "KRAPINSKO-ZAGORSKA",
        "VARAŽDINSKA",
    ],
    "Sobar/sobarica": [
        "ISTARSKA",
        "PRIMORSKO-GORANSKA",
        "DUBROVAČKO-NERETVANSKA",
        "ŠIBENSKO-KNINSKA",
        "ZADARSKA",
        "SPLITSKO-DALMATINSKA",
        "GRAD ZAGREB",
        "ZAGREBAČKA",
        "KARLOVAČKA",
    ],
    "Prodavač/prodavačica (01.05.–30.09.)": [
        "ISTARSKA",
        "DUBROVAČKO-NERETVANSKA",
    ],
}


export default function OccupationCountyMap() {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const topoRef = useRef<GeoJSON.FeatureCollection | null>(null)

    const [activeOccupation, setActiveOccupation] = useState<string | null>(null)
    const [activeCounty, setActiveCounty] = useState<string | null>(null)

    useEffect(() => {
        d3.json("/maps/zupanije.topojson").then((topology: any) => {
            topoRef.current = topojson.feature(
                topology,
                topology.objects.zupanije_srpj
            ) as GeoJSON.FeatureCollection
            draw()
        })
    }, [])

    useEffect(() => {
        draw()
    }, [activeOccupation, activeCounty])

    const draw = () => {
        if (!svgRef.current || !topoRef.current) return

        const height = 500
        const width = 800

        const svg = d3.select(svgRef.current)
        svg.attr("viewBox", `0 0 ${width} ${height}`)

        const projection = d3.geoMercator()
        projection.fitSize([width, height], topoRef.current)

        const path = d3.geoPath(projection)

        svg
            .selectAll("path")
            .data(topoRef.current.features)
            .join("path")
            .attr("d", path as any)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.6)
            .attr("fill", d => {
                const name = d.properties?.name?.toUpperCase() || "" // <-- safe fallback

                if (ALL_COUNTIES_OCCUPATIONS.includes(activeOccupation || "")) {
                    return "green"
                }

                if (
                    activeOccupation &&
                    OCCUPATIONS_BY_COUNTY[activeOccupation]?.includes(name)
                ) {
                    return "green"
                }

                if (activeCounty === name) {
                    return "green"
                }

                return "#eee"
            })
            .on("mouseenter", (_, d: any) => {
                setActiveCounty(d.properties?.name?.toUpperCase() || null) // <-- safe
                setActiveOccupation(null)
            })

    }

    return (
        <div
            className="
                flex
                flex-col
                sm:flex-row
            "
        >
            {/* LEFT LIST */}
            <div
                className="
                    w-96
                    max-h-[80vh]
                    lg:max-h-[60vh]
                    overflow-y-auto
                    text-sm
                "
                style={{ direction: "rtl" }}
            >
                <div style={{ direction: "ltr", paddingLeft: "0.5rem" }}>
                    <strong>Prema županijama</strong>
                    <ul>
                        {Object.keys(OCCUPATIONS_BY_COUNTY).map(o => (
                            <li
                                key={o}
                                onMouseEnter={() => {
                                    setActiveOccupation(o)
                                    setActiveCounty(null)
                                }}
                                style={{
                                    cursor: "pointer",
                                    color:
                                        activeOccupation === o ||
                                            OCCUPATIONS_BY_COUNTY[o]?.includes(activeCounty || "")
                                            ? "green"
                                            : "grey",
                                    fontWeight:
                                        activeOccupation === o ||
                                            OCCUPATIONS_BY_COUNTY[o]?.includes(activeCounty || "")
                                            ? 700
                                            : 400,
                                }}
                            >
                                {o}
                            </li>
                        ))}
                    </ul>

                    <strong style={{ paddingTop: "1rem", display: "block" }}>Sve županije</strong>

                    <ul>
                        {ALL_COUNTIES_OCCUPATIONS.map(o => (
                            <li
                                key={o}
                                onMouseEnter={() => {
                                    setActiveOccupation(o)
                                    setActiveCounty(null)
                                }}
                                style={{
                                    cursor: "pointer",
                                    color:
                                        activeOccupation === o || activeCounty !== null
                                            ? "green"
                                            : "grey",
                                    fontWeight:
                                        activeOccupation === o || activeCounty !== null
                                            ? 700
                                            : 400,
                                }}
                            >
                                {o}
                            </li>
                        ))}
                    </ul>

                </div>

            </div>

            <svg
                ref={svgRef}
                className="
                block
                w-full
                flex-[2_0_0%] 

                md:flex-[1_0_0%] 
                md:min-w-[600px]
                md:max-h-[80vh]
                "
            />


        </div>
    )
}
