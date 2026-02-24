"use client"

type Result = {
  country: string
  language: string
  meta: number
  mup: number
  delta: number // % difference
}

type GroupResults = {
  id: number
  label: string
  results: Result[]
}

const groups: GroupResults[] = [
  {
    id: 0,
    label: "Balkanski jezici",
    results: [
      { country: "Sj. Makedonija", language: "makedonski", meta: 53750, mup: 11856, delta: 353 },
      { country: "Bosna i Hercegovina", language: "bosanski", meta: 67250, mup: 32225, delta: 109 },
      { country: "Kosovo", language: "albanski", meta: 11850, mup: 6355, delta: 87 },
      { country: "Srbija", language: "srpski", meta: 41350, mup: 24278, delta: 70 },
    ],
  },
  {
    id: 1,
    label: "Daleka Azija",
    results: [
      { country: "Indija", language: "hindski", meta: 5450, mup: 15400, delta: -65 },
      { country: "Nepal", language: "nepalski", meta: 19700, mup: 31708, delta: -38 },
      { country: "Filipini", language: "filipinski", meta: 14000, mup: 17629, delta: -21 },
    ],
  },
  {
    id: 2,
    label: "Ostalo",
    results: [
      { country: "Uzbekistan", language: "uzbečki", meta: 1750, mup: 5521, delta: -68 },
      { country: "Bangladeš", language: "bengalski", meta: 3400, mup: 3404, delta: 0 },
      { country: "Egipat", language: "arapski", meta: 6650, mup: 5504, delta: 21 },
      
      
    ],
  },
]

export default function MetaMupSideBySideBars() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* FLEX 3 COLUMNS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {groups.map((group) => (
          <div key={group.id} className="flex-1 text-center">
            <h3 className="text-xl font-semibold mb-4">{group.label}</h3>

            {group.results.map((r, idx) => {
              // Compute bar width relative to the larger value
              const max = Math.max(r.meta, r.mup)
              const metaWidth = (r.meta / max) * 100
              const mupWidth = (r.mup / max) * 100

              // Bar color: blue if Meta > MUP, orange if Meta < MUP
              const barColor =
                r.delta > 0 ? "#1976D2" :
                  r.delta < 0 ? "#FDAE6B" :
                    "#4B5563";

              return (
                <div key={idx} className="mb-6 bg-gray-50 py-5 px-3 rounded-lg">
                  {/* Country + language */}
                  <div className="mb-2 font-medium text-gray-800">
                    {r.country} ({r.language})
                  </div>

                  {/* Row layout */}
                  <div className="flex items-center gap-4">

                    <div className="flex-1 text-left text-sm text-gray-700">
                      <div className="font-semibold text-[#FDAE6B]">MUP</div>
                      <div>{r.mup.toLocaleString("fr-FR")}</div>
                    </div>

                    {/* Horizontal bar */}
                    <div className="flex-1 relative h-6 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-6 rounded-full top-0 left-0"
                        style={{ width: `${Math.max(metaWidth, mupWidth)}%`, backgroundColor: barColor }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                        {r.delta > 0 ? `+${r.delta}%` : r.delta < 0 ? `${r.delta}%` : "≈ 0%"}
                      </div>
                    </div>

          
                    <div className="flex-1 text-right text-sm text-gray-700">
                      
                      <div className="font-semibold text-[#1976D2]">Meta</div>
                      <div>{r.meta.toLocaleString("fr-FR")}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
