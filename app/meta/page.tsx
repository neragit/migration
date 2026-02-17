//app/meta/page.tsx 

"use client";

import BubbleChart from "../components/BubbleChart";
import MetaContainer from "../components/MetaContainer";
import MetaBars from "../components/MetaBars";


export default function MetaPage() {

    return (

        <>


            <main
                className="flex-1 mt-20 min-w-0 px-5  text-gray-700 flex justify-center "
                id="start"
            >


                <div className="w-full max-w-4xl  ">

                    <h1 className="mb-8 max-w-[900px] text-4xl sm:text-5xl font-bold leading-tight">
                        <span style={{ color: "#c51b8a" }}>Meta signali:</span> mogu li društveni mediji pomoći u provjeri službenih podataka?
                    </h1>


                    <section className="section" >

                        <p className="paragraph">
                            Meta Platforms, Inc. <b>(Facebook, Instagram, WhatsApp, Messenger, Threads)</b> procjenjuje potencijalnu publiku za oglašavanje na temelju dostupnih podataka o korisnicima kao što su demografski podaci, interesi i aktivnosti kako bi omogućila ciljanje oglasa.
                            Često se pri procjeni veličine potencijalne publike polazi od <b>jezika korisnika</b>, pri čemu se analiza provodi prvenstveno na temelju postavki jezika korisničkog sučelja (primarni signal), ali i na temelju dodatnih pokazatelja, poput jezika kojim korisnik najčešće komunicira (sekundarni signal).
                            To <b>ne znači</b> da ta procjena označava nacionalnost, etničku pripadnost, rasu ili porijeklo korisnika.
                            Ako osoba koristi drugi jezik, primjerice engleski, bit će uključena u publiku za taj jezik, bez obzira na njezino državljanstvo ili podrijetlo.
                        </p>


                    </section>


                    <section className="section" >

                        <h2>Privatnost podataka</h2>

                        <p className="paragraph">
                            S obzirom na to da su podaci <b>anonimizirani i agregirani na razini skupine</b>, moguće je koristiti alate poput Meta Ads Managera i Graph API za analizu publike u istraživačke svrhe pod uvjetom poštivanja pravila privatnosti.
                            U Europskoj uniji primjenjuje se GDPR.
                            Radi očuvanja privatnosti, Meta u prikazu procjene potencijalne publike koristi raspon između <b>minimalne i maksimalne vrijednosti</b>.
                            Vrlo male vrijednosti nisu prikazane, npr. procjena od 0 do 1000 korisnika može se prikazati kao "&lt;1000".


                        </p>

                        

                        <img
                            src="/meta.png"
                            alt="Meta header"
                            className="w-full h-auto"
                        />



                    </section>

                    <section className="section" >


                        <h2>Procjena korisnika u Hrvatskoj</h2>

                        <p className="paragraph">
                            U svibnju 2025. u Hrvatskoj je procjenjeno <b>2 496 900 korisnika Facebooka</b>, što je otprilike 65% ukupne populacije. To je u skladu s rasponom kojeg Meta Ads Manager daje u veljači 2026. (između 2 400 000 i 2 800 000 korisnika).
                            Važno je naglasiti da ova procjena nije precizan popis korisnika i može se razlikovati ovisno o kriterijima targetiranja, računanju duplikata i slično.

                            <img
                                src="/ads_manager.png"
                                alt="Meta Ads Manager procjena korisnika u Hrvatskoj"
                                className="w-full h-auto my-10"

                            />

                        </p>

                    </section>



                    <section className="section" >

                        <h2>Procjena korisnika prema jeziku</h2>

                        <p className="paragraph">
                            Procjena potencijalne publike na temelju Meta Ads Managera uzeta je kao <b>prosjek raspona minimalne i maksimalne vrijednosti</b>.
                            Pri odabiru lokacije, Meta procjenjuje korisnike koji provode vrijeme na toj lokaciji, kao što su ljudi koji tu žive ili su nedavno tu bili.
                            Polazni kriterij za odabir jezika je MUP-ova lista top 10 stranih državljanstava, a radi točnije procjene uključeni su najkorišteniji jezici u Hrvatskoj poput hrvatskog i engleskog, zatim službeni jezici susjednih i drugih europskih zemalja te svjetski jezici poput kineskog, japanskog itd.
                            Hrvatski i engleski su očekivano prepoznati kao najkorišteniji jezici u Hrvatskoj.
                        </p>


                        <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Procjena publike prema jeziku na temelju pojedinačne pretrage putem Meta Ads Manager UI
                        </h3>

                        <BubbleChart />
                        <div style={{ fontSize: '12px', color: '#555' }}>
                            Vizualizaciju je moguće uvećati scrollanjem prema gore. Podaci su prikupljeni u veljači 2026.
                        </div>

                        <p className="paragraph mt-10">
                            Jezici urdu, telugu, marathi, tamilski, gudžaratski, kannada, malajalamski, pandžabi, asamski i odija, koji pripadaju indijskoj jezičnoj skupini, isključeni su jer je procijenjena publika prema Meta Ads Manageru bila manja od 1000 korisnika.
                            Isto tako, europski jezici poput irskog, malteškog, islandskog, norveškog, finskog i estonskog te drugi jezici poput korejskog, farskog, kazahstanskog, tadžičkog također nisu prikazani zbog vrlo male procijenjene publike (ispod 1000).
                            Crnogorski i romski nisu na listi jezika Ads Manager-a.
                        </p>

                    </section>

                    <section className="section">



                        <h2>Usporedba podataka Meta Ads Managera-a s brojem dozvola MUP-a</h2>

                        <MetaBars />

                        <section className="section mt-20" >

                            <h2>Razlike u procjenama Meta Ads Managera-a i Graph API-ja</h2>

                            <p className="paragraph ">
                                xxxxxxU nekim znanstvenim radovima navodi se da <b>procjene publike dobivene putem API mogu biti preciznije</b> (tj. manjim rasponima) nego one koje se prikazuju u sučelju Ads Managera.
                                Korisnici često prijavljuju da Ads Manager prikazuje &lt;1000 ili <b>jako malu publiku</b> iako stvarni promet ili podaci pokazuju daleko veće brojeve, što može biti rezultat Meta ograničenja ili načina prikaza procjena.
                                Moguće je da Meta namjerno ograničava procjenu publike radi privatnosti korisnika ili vlastitih strategija.
                            </p>

                            <p className="paragraph ">
                                Međutim, analiza
                            </p>


                            <MetaContainer />

                            <p className="paragraph">
                            Ova vizualizacija služi samo u obrazovne i istraživačke svrhe.
                            Prikazani podaci iz Meta Marketing API-ja su agregirani i ne sadrže osobne ili identificirajuće informacije.
                            Prikazane uvide služe analitičkoj demonstraciji i nisu namijenjene komercijalnoj upotrebi.

                        </p>


                        </section>




                        <h2 className="mt-20">Balkanski jezici: Meta uglavnom
                            <span style={{ color: "#00a651" }}> "precjenjuje" </span>oko 2 puta više
                        </h2>
                        <ul>
                            <li><b>Bosna i Hercegovina</b>: Meta 67 250 i MUP 32 225 (<span style={{ color: "#00a651", fontWeight: "bold" }}>+109%</span>)</li>
                            <li><b>Srbija</b>: Meta 41 350 i MUP 24 278 (<span style={{ color: "#00a651", fontWeight: "bold" }}>+70%</span>) - Meta vjerojatno broji i Crnu Goru</li>
                            <li><b>Kosovo</b>: Meta 11 850 i MUP 6 355 (<span style={{ color: "#00a651", fontWeight: "bold" }}>+87%</span>) - Meta broji sve albanske govornike, uključujući Albaniju</li>
                            <li><b>Sj. Makedonija</b>: Meta 53 750 i MUP 11 856 (<span style={{ color: "#00a651", fontWeight: "bold" }}>+353%</span>) - ova vrijednost je posebno zanimljiva i sugerira značajnu pogrešnu klasifikaciju jezika ili intenzivno prekogranično putovanje</li>
                        </ul>



                        <div className="relative mt-20">

                            <span className="absolute top-0 left-0 text-gray-300 text-[10rem]  font-extrabold opacity-20 -z-10 select-none">
                                1
                            </span>


                        </div>


                        <h3 className="relative text-xl sm:text-2xl font-bold text-green-600">
                            Kratkotrajna putovanja preko granice
                        </h3>


                        <p className="paragraph pl-10 lg:pl-30">

                            Govornici bosanskog, srpskog i makedonskog jezika mogu slobodno putovati unutar EU bez boravišnih dozvola. Meta bilježi aktivnost uređaja u Hrvatskoj (uključujući posjetitelje), dok MUP broji samo stanovnike. To povećava Meta procjene za balkanske jezike.
                        </p>

                        <div className="relative mt-20">

                            <span className="absolute top-0 right-0 text-gray-300 text-[10rem]  font-extrabold opacity-20 -z-10 select-none">
                                2
                            </span>


                            <h3 className="relative text-xl sm:text-2xl font-bold text-green-600">
                                Problemi klasifikacije jezika
                            </h3>
                        </div>

                        <p className="paragraph  pr-10 lg:pr-30 ">
                            Hrvatski, bosanski, srpski i crnogorski međusobno međusobno su razumljivi. Zbog <b>sličnosti među balkanskim jezicima i  razlikama među dijalektima</b>, moguće je da dolazi do pogrešne klasifikacije. Npr. ikavica i ekavica u odnosu na ijekavicu. Međutim, Meta detektira jezik prvenstveno prema postavkama sučelja (koje korisnik može konfigurirati) pa bi se očekivalo da je procjena u skladu s govornim jezikom.<br /><br />

                            S obzirom da Meta <b>ne prepoznaje za crnogorski jezik</b>, ova je skupina sigurno ubrojena u jedan od ostalih jezika, najvjerojatnije srpski. Nažalost MUP nije objavio podatke za Crnu Goru jer nije u top 10 državljanstava u Hrvatskoj, pa se može samo pretpostaviti da je taj broj ispod 3 400. Međutim, kad bi oduzeli ovu razliku, i dalje je razlika između brojeva značajna (17 072).<br /><br />

                            Također, budući da <b>većina stanovništva Kosova koristi albanski jezik</b>, u analizi su podaci za Kosovo (MUP) upareni s albanskim jezikom (Meta). Time bi se moglo objasniti zašto Meta precijenjuje Kosovo - zapravo broji sve albanske govornike, uključujući Albaniju. Slično kao za Crnu Goru, MUP nije objavio podatke za Albaniju pa se može samo pretpostaviti da je taj broj ispod 3 400. To bi djelomično objasnilo razliku od 5 495.
                        </p>


                        <h2 className="mt-20">Daleka azija: Meta
                            <span style={{ color: "#c51b8a" }}> "podcjenjuje" </span>od 35% do 65%
                        </h2>
                        <ul>
                            <li><b>Indija (hindski)</b>: Meta 5 450 i MUP 15 400 (<span style={{ color: "#c51b8a", fontWeight: "bold" }}>-65%</span>)</li>
                            <li><b>Nepal (nepalski)</b>: Meta 19 700 i MUP 31 708 (<span style={{ color: "#c51b8a", fontWeight: "bold" }}>-38%</span>)</li>
                            <li><b>Filipini (filipinski)</b>: Meta 14 000 i MUP 17 629 (<span style={{ color: "#c51b8a", fontWeight: "bold" }}>-21%</span>)</li>
                        </ul>

                        <div className="relative mt-20">

                            <span className="absolute top-0 left-0 text-gray-300 text-[10rem]  font-extrabold opacity-20 -z-10 select-none">
                                1
                            </span>

                            <h3 className="relative text-xl sm:text-2xl font-bold text-pink-700">
                                Engleski kao svjetski jezik
                            </h3>
                        </div>

                        <p className="paragraph pl-10 lg:pl-30">Engleski se koristi kao <b>drugi službeni jezik u Filipinima i Indiji</b>. Azijske migrantske skupine (indijske, filipinske, nepalske) često govore engleski i moguće je da koriste englesko sučelje na Meta platformama. U tom slučaju ih Meta može kategorizirati kao govornike engleskog, dok ih MUP broji prema državljanstvu bez obzira na jezik.</p>

                        <p className="paragraph pl-10 lg:pl-30">Također, što se tiče Filipina treba uzeti u obzir i korištenje Cebuano jezika koji je prepoznat pomoću Meta Ads Managera. Otprilike 1 200 govornika djelomično objašnjava razliku od 3 629.</p>

                        <div className="relative mt-20">

                            <span className="absolute top-0 right-0 text-gray-300 text-[10rem]  font-extrabold opacity-20 -z-10 select-none">
                                2
                            </span>


                            <h3 className="relative text-xl sm:text-2xl font-bold text-pink-700">
                                Vremenske promjene
                            </h3>
                        </div>


                        <p className="paragraph pr-10 lg:pr-30 ">S obzirom da su navedeni MUP-ovi podaci iz prosinca 2025. a Meta prikazuje aktualne podatke u veljači 2026. <b>moguće je da se broj stranaca iz azijskih zemalja u međuvremenu smanjio</b>.</p>


                        <div className="relative mt-20">

                            <span className="absolute top-0 left-0 text-gray-300 text-[10rem]  font-extrabold opacity-20 -z-10 select-none">
                                3
                            </span>


                            <h3 className="relative text-xl sm:text-2xl font-bold text-pink-700">
                                Preferencije aplikacija
                            </h3>
                        </div>


                        <p className="paragraph pl-10 lg:pl-30 ">Jedno od objašnjenja manjeg broja veličine publike azijskog podrijetla u Hrvatskoj može biti <b>manje korištenje ovih društvenih mreža</b>. Moguće ja da ove populacije preferiraju Tik Tok, Snapchat, X (Twitter), Telegram ili druge aplikacije. Međutim, u svim navedenim zemljama Meta aplikacije su među najpopularnijima, osim u Uzbekistanu.</p>

                        <div className="paragraph bg-pink-50 p-6 rounded-lg mt-25">
                            Iako je <b>WhatsApp</b> u Meta vlasništvu, vjerojatno nije uključen u procjene ako korisnik ne koristi druge aplikacije jer Meta u Hrvatskoj zasad ne može prikazivati oglase na WhatsApp-u, što će se uskoro promijeniti. Meta je u procesu lansiranja WhatsApp Business API diljem svijeta, te je tvrtka najavila da će koristiti lokaciju korisnika, jezik i podatke s Instagrama i Facebooka za prilagođavanje oglasa na WhatsAppu. Meta predstavnici najavili su da su nove značajke osmišljene „na način koji najviše poštuje privatnost“ i naglasili da će se dijeljenje podataka između WhatsAppa, Instagrama i Facebooka biti moguće samo kad se korisnici odluče za povezivanje svojih računa. Međutim, Europska komisija nedavno je formalno odredila WhatsApp kao Vrlo veliku online platformu (VLOP) prema Zakonu o digitalnim uslugama (DSA) te je postavljen rok do sredine svibnja 2026. da se WhatsApp uskladi s pravilima Europske unije namijenjenim <b>zaštiti privatnosti korisnika</b>. Ovaj potez dio je pojačanog regulatornog pritiska EU protiv glavnih američkih tehnoloških platformi. Administracija američkog predsjednika Donalda Trumpa prethodno je aspekte DSA označila kao "cenzuru" i potencijalno diskriminirajući tretman američkih tvrtki. WhatsApp se već suočava s posebnim nadzorom EU, zbog antimonopolske istrage pokrenute u prosincu 2025. o tome krši li uvođenje AI značajki pravila tržišnog natjecanja.</div>


                    </section>

                    <section className="section">

                        <h2>Poseban slučaj Egipta i arapskog jezika</h2>

                        <p className="paragraph">
                            <b>Egipat (arapski)</b>: Meta 6 650 i MUP 5 504 (<span style={{ color: "#00a651", fontWeight: "bold" }}>+21%</span>)
                        </p>

                        <p className="paragraph">
                            Meta vjerojatno "precijenjuje" Egipat jer se <b>arapski jezik koristi u brojnim zemljama Bliskog istoka i Sjeverne Afrike</b>, što može dovesti do uključivanja drugih arapskih govornika u Hrvatskoj koji nisu na MUP-ovoj listi top 10 (Sirija, Jordan, Palestina, itd.). Isto tako, Meta vjerojatno broji i turiste iz arapskih zemalja koji trenutno borave u Hrvatskoj. U svakom slučaju radi se o relativno maloj razlici od svega 1 146 i treba uzeti u obzir da Meta daje procjenu u rasponu, a ovdje je korišten prosjek te procjene pa može doći do malog odstupanja.</p>


                        <h2 className="mt-20" >Bangladeš kao kontrolna skupina</h2>

                        <p className="paragraph">
                            <b>Bangladeš (bengalski)</b>: Meta 3 400 i MUP 3 404 (<span style={{ color: "#555", fontWeight: "bold" }}> ≈ 0%</span>)
                        </p>

                        <p className="paragraph pr-10 lg:pr-30">
                            Na temelju vidljivih rezultata i dodatnog konteksta, Bangladeš se može uzeti kao kontrolna skupina koja potvrđuje točnost Meta procjena kada su ispunjeni <b>sljedeći uvjeti:</b>
                        </p>

                        <div className="paragraph bg-gray-50 p-6 rounded-lg ">
                            <ul className="mb-6 font-bold">
                                <li>1. Niska razina poznavanja engleskog jezika</li>
                                <li>2. Značajno korištenje Meta aplikacija u odnosu na ostale opcije</li>
                                <li>3. Nema kratkotrajnog prekograničnog kretanja s Hrvatskom kao kod susjednih zemalja</li>
                                <li>4. Minimalna jezična konfuzija (bengalski je specifičan jezik)</li>
                            </ul>
                        </div>

                        <h2 className="mt-20">Uzbekistan i drugačije digitalne navike</h2>

                        <p className="paragraph">
                            <b>Uzbekistan (uzbečki)</b>: Meta 1 750 i MUP 5 521 (<span style={{ color: "#c51b8a", fontWeight: "bold" }}>-68%</span>)
                        </p>

                        <p className="paragraph ">
                            Uzbekistan je bio dio Sovjetskog Saveza od 1924. do 1991. godine, te je ruski bio obavezan jezik koji je do danas u upotrebi. Time bi se mogla djelomično objasniti ova razlika. Međutim, danas sve manje Uzbekistanaca aktivno koristi ruski, posebno mlađe generacije i ruralna populacija. Stoga je ovo objašnjenje manje vjerojatno ako su uzbečki migrati nižeg obrazovanja. S druge strane, <b>u Uzbekistanu preko 70% populacije koristi Telegram</b> zbog povijesnog konteksta cenzure i nadzora. Telegram funkcionira ne samo kao privatni messenger već i kao primarna platforma za vijesti u <b>Srednjoj Aziji</b>, s tisućama kanala koji prenose sve od vladinih objava do komentara građana. Za razliku od Facebooka, Instagrama i drugih platformi koje su često bile blokirane jer Meta nije pristala pohraniti podatke lokalno u Uzbekistanu, što je dovelo do blokada od 2021. do 2022. Telegram je postao <b>toliko integriran u uzbekistansko društvo da ga čak ni vlada ne može trajno blokirati</b>. Pokušaj blokade u studenom 2021. trajao je samo nekoliko sati prije nego što je predsjednik morao ponovno omogućiti pristup. Telegram je toliko proširen i dugo percipiran kao najsigurnija opcija, da se njegova popularnost održala i nakon što je 2024. uhićen osnivač Pavel Durov zbog nesuradnje s vlastima u istragama kriminala na platformi, kada se promijenila Telegramova politika privatnosti te je od tada značajno porasla suradnja s vlastima. Ako uzbečki migranti u Hrvatskoj koriste Telegram, i eventualno dodaju WhatsApp za europsku integraciju, ali rijetko usvajaju Facebook/Instagram kao primarne platforme, to može objasniti značajno "podcjenjivanje".
                        </p>

                        <div className="bg-blue-50 p-6 rounded-lg my-6">

                            <h3 className="text-xl font-bold mt-8 mb-4">Nudi li Meta enkripciju?</h3>

                            <p className="paragraph">
                                <b>Da, ali s ograničenjima.</b> Meta je u prosincu 2023. godine počela uvođenje <b>end-to-end enkripcije</b> (E2EE) kao zadane postavke za privatne razgovore na Messengeru i Facebooku. Ovaj postupak osigurava da samo pošiljatelj i primatelj mogu razumjeti sadržaj poruke - čak ni Meta ne može pristupiti poruci. Međutim, postoji ključna razlika između enkripcije na WhatsAppu i Messengeru. WhatsApp čuva enkriptirane backupe u cloudu (iCloud/Google Drive) s ključem koji poznaje samo korisnik, dakle niti WhatsApp ni cloud provider ne mogu ih dešifrirati. <b>Messenger čuva enkriptirane sigurnosne kopije poruka na Meta serverima</b> kako bi korisnici mogli pristupiti svojim porukama s bilo kojeg uređaja. Iako Meta ne može dešifrirati te sigurnosne kopije, ova metoda narušava "savršenu tajnost" (perfect forward secrecy) - sigurnosnu značajku koja sprečava dešifriranje svih poruka ako se pristup jednoj poruci postigne.
                            </p>

                            <div className="bg-blue-100 p-6 rounded-lg my-6">

                                <ul className="space-y-2">
                                    <li><b>WhatsApp</b>: E2EE zadano od 2016. godine</li>
                                    <li><b>Messenger (1-na-1 razgovori)</b>: E2EE zadano od prosinca 2023.</li>
                                    <li><b>Instagram Direct Messages</b>: E2EE u postupnom uvođenju</li>
                                    <li><b>Facebook grupe, poslovni chatovi, Marketplace</b>: Nisu enkriptirani </li>
                                </ul>
                            </div>



                            <h3 className="text-xl font-bold ">Dijeli li Meta podatke s vladama?</h3>

                            <p className="paragraph">
                                Meta dijeli korisničke podatke s vladinim agencijama diljem svijeta kao odgovor na službene zahtjeve u okviru zakona. Ovisno o zahtjevu, Meta može dijeliti kreditne kartice, adrese e-pošte, IP adrese prijave/odjave, poruke, fotografije, videozapise, objave na vremenskoj crti i informacije o lokaciji. Samo u 2022. godini zabilježeno je <b>476 802 zahtjeva</b> od vlada iz 130 zemalja, obuhvaćajući preko <b>800 000 korisničkih računa</b>. Meta je pristala na <b>76% svih zahtjeva</b>, a između 2014. i 2024. godine dijeljenje podataka s vladinim tijelima poraslo je za <b>675%</b>. Najviše podataka zahtijevaju <b>SAD</b> (236 000 korisnika), <b>Indija</b> (198 015 korisnika), <b>Brazil</b> (121 097 korisnika), <b>Njemačka</b> (51 783 korisnika) i <b>Izrael</b> (oko 60 zahtjeva na svakih 100,000 stanovnika što je na razini SAD-a ako se uzme u obzir veličina populacije).
                            </p>


                        </div>

                    </section>



                    <section className="section" >

                        <h2>Zaključak</h2>

                        <section className="section" >



                            <p className="paragraph">
                                Meta precjenjuje balkanske jezike i podcjenjuje azijske jezike vjerojatno zbog <b>razlika u metodologiji</b>.
                                Meta uključuje prekogranične putnike, sezonske radnike i turiste koja održava kulturne veze, dok
                                MUP broji osobe s dozvolom za rad i boravak.

                            </p>

                            <h2>Teškoće u procjenama</h2>

                            <ul className="list-disc pl-5 mb-10 font-bold">
                                <li>Neusklađene brojke s drugim izvorima</li>
                                <li>Ograničenja u prikazu vrlo malih ili specifičnih skupina</li>
                                <li>Razlike u procjenama publike između Ads Managera i Graph API</li>
                            </ul>

                        </section>

                    </section>


                    <section className="section" >

                        <ul >
                            <li>
                                <span> Npr.{" "}
                                    <a href="https://www.researchgate.net/figure/Part-of-a-screenshot-of-Facebooks-Adverts-Manager-illustrating-some-of-the-targeting_fig1_324069454"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Mejova, Weber i Fernandez-Luque (2018). Online Health Monitoring using Facebook Advertisement Audience Estimates in the United States: Evaluation Study
                                    </a>
                                </span>
                            </li>

                            <li>
                                <span> {" "}
                                    <a href="https://www.reddit.com/r/FacebookAds/comments/1jb6kop/meta_admits_they_apply_restrictions_on_the_size/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Reddit </a>
                                </span>
                            </li>

                            <li>
                                <span> {" "}
                                    <a href="https://stats.napoleoncat.com/facebook-users-in-croatia/2025/05/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        NapoleonCat </a>
                                </span>
                            </li>

                        </ul>

                    </section>

                </div >

            </main >

        </>
    );
}
