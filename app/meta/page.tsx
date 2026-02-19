//app/meta/page.tsx 

"use client";

import BubbleChart from "../components/BubbleChart";
import MetaBars from "../components/MetaBars";

import MetaContainer from "../components/MetaContainer";
import Rezultati from "../components/Rezultati";
import Objasnjenja from "../components/Objasnjenja";

import Details from "../components/Details";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";


export default function MetaPage() {

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

                        <p className="paragraph">Koliko stranih radnika stvarno boravi u Hrvatskoj?
                            Koliko ih radi neprijavljeno?
                            Koliko ih je napustilo zemlju bez odjave?
                            Koliko ih ostaje, a koliko odlazi dalje u EU?
                            Što zapravo predstavlja broj izdanih radnih dozvola?
                            Jesu li podaci MUP-a, HZMO-a i Ministarstva rada međusobno usklađeni? Bez jasnih i usklađenih podataka, teško je odgovoriti na šira pitanja koja dominiraju javnim prostorom: Je li Hrvatska tranzitna ili useljenička zemlja? Koliki je stvarni rizik zloupotrebe sustava?
                            Radi li se o privremenoj radnoj snazi ili trajnoj migraciji?
                            Dolaze li radnici sezonski ili ostaju dugoročno?
                            Je li uvoz radne snage zamjena za demografsku politiku i povratak iseljenih?
                            Koliko migranti doprinose proračunu?
                            Koliko košta integracija?
                            Postoji li strategija integracije?
                            Ima li država kapaciteta u obrazovanju, stanovanju i socijalnom sustavu?
                            Nudi li zakon stvarno rješenje ili samo kozmetičke izmjene?</p>

                        <img
                            src="/news.png"
                            alt="News collage"
                            className="w-full h-auto my-15"
                        />

                        <p className="paragraph">
                            Otkad su ukinute kvote za zapošljavanje stranih radnika u Hrvatskoj,<b> migracije i dolazak stranih radnika postali su jedno od najpolariziranijih društvenih pitanja</b>. Javna rasprava često se kreće između dva ekstrema. Velik dio medijskih tekstova, osobito analitičkih i komentatorskih, naglašava neusklađenost statistika, nekontroliran rast broja radnih dozvola i negativne društvene posljedice, čime implicitno ili eksplicitno sugerira zabrinutost i sistemsku neuređenost.
                            Istovremeno, neki od izvora tvrde da su alarmističke interpretacije pretjerane ili politički motivirane.
                            U svakom slučaju, <b>brojke postaju politički argument</b>, a interpretacija podataka oblikuje percepciju stvarnosti. U središtu ove rasprave nalazi se temeljno, ali iznenađujuće teško pitanje:</p>

                        <h2>Koliko je stvarno stranih radnika u Hrvatskoj?</h2>

                        <p className="paragraph">Bez preciznih i usporedivih brojki nemoguće je racionalno procijeniti učinke migracija niti oblikovati održive javne politike. Ako su podaci fragmentirani, zakašnjeli ili neusklađeni, prostor se otvara za spekulacije, političku instrumentalizaciju i polarizaciju javnosti. Ova analiza polazi upravo od tog problema: <b>može li digitalni trag, poput agregiranih podataka društvenih mreža, poslužiti kao dodatni alat za provjeru službenih statistika?</b> Ne kao zamjena, nego kao nadopuna za razumijevanje stvarnosti.</p>

                        <img
                            src="/meta.png"
                            alt="Meta header"
                            className="w-full h-auto mt-15"
                        />

                        <p className="paragraph mt-20">
                            Meta Platforms, Inc. <b>(Facebook, Instagram, WhatsApp, Messenger, Threads)</b> koristi dostupne podatke o korisnicima kao što su demografski podaci, interesi i aktivnosti kako bi omogućila procjenu potencijalne publike za oglašavanje i bolje ciljanje oglasa. Ako analiziramo ove podatke možemo dobiti uvid u to koje su zajednice aktivne na internetu, kako se jezik i lokacija preklapaju, pa čak i kako se trendovi mijenjaju tijekom vremena. Iako ovi brojevi ne odražavaju savršeno službene podatke o stanovništvu, oni nude <b>dinamičan uvid u društvo u stvarnom vremenu</b> koji može pomoći tvrtkama, političarima i istraživačima da razumiju digitalne tragove različitih populacija. Praćenje tih promjena tijekom vremena može otkriti suptilne obrasce, od novih kulturnih trendova do promjena u mobilnosti, za koje tradicionalne statistike mogu biti potrebni mjeseci ili godine.

                        </p>


                        <div className="flex flex-col md:flex-row w-full md:max-h-[450px] gap-4 mt-20">

                            <p className="paragraph md:pr-15 ">Pri procjeni veličine potencijalne publike često se polazi od jezika korisnika, pri čemu se analiza provodi <b>prvenstveno na temelju postavki jezika korisničkog sučelja</b> (primarni signal), ali i na temelju dodatnih pokazatelja, poput <b>jezika kojim korisnik najčešće komunicira</b> (sekundarni signal).
                                To ne znači da ta procjena označava nacionalnost, etničku pripadnost, rasu ili porijeklo korisnika.
                                Ako osoba koristi drugi jezik, primjerice engleski, bit će uključena u publiku za taj jezik, bez obzira na njezino državljanstvo ili podrijetlo.
                            </p>

                            <img
                                src="/meta-jezik.jfif"
                                alt="Meta AI"
                                className="w-5/6 mx-auto md:w-1/5 h-auto rounded-2xl"
                            />

                            <img
                                src="/meta-lokacija.jfif"
                                alt="Meta AI"
                                className="w-5/6 mx-auto md:w-1/5 h-auto rounded-2xl "
                            />
                        </div>

                        <div className="flex flex-col-reverse md:flex-row w-full md:max-h-[400px] gap-4 mt-10 md:mt-25">

                            <img
                                src="/meta-analiza.jfif"
                                alt="Meta AI"
                                className="w-5/6 mx-auto md:w-1/5 h-auto rounded-2xl"
                            />

                            <img
                                src="/meta-privatnost.jfif"
                                alt="Meta AI"
                                className="w-5/6 mx-auto md:w-1/5 h-auto rounded-2xl "
                            />

                            <p className="paragraph md:pl-15">S obzirom na to da su podaci <b>anonimizirani i agregirani na razini skupine</b>, moguće je koristiti alate poput Meta Ads Managera i Graph API-ja za analizu publike u istraživačke svrhe pod uvjetom poštivanja pravila privatnosti.
                                U Europskoj uniji primjenjuje se GDPR.
                                Radi očuvanja privatnosti, Meta u prikazu procjene potencijalne publike koristi raspon između <b>minimalne i maksimalne vrijednosti</b>.
                                Vrlo male vrijednosti nisu prikazane, npr. procjena od 0 do 1 000 korisnika može se prikazati kao "ispod 1 000".
                            </p>
                        </div>

                    </section>


                    <section className="section mt-15" >

                        <h2>Procjena korisnika u Hrvatskoj</h2>

                        <p className="paragraph">
                            U svibnju 2025. u Hrvatskoj je procjenjeno <b>2 496 900 aktivnih korisnika Facebooka</b>, što je otprilike 65% ukupne populacije. To je u skladu s rasponom publike kojeg Meta Ads Manager daje u veljači 2026. (između 2 400 000 i 2 800 000 korisnika).
                            Međutim, kad se targetira koristeći više karakteristika, a ne isključivo lokacije, stvari brzo postanu zamršene i važno je naglasiti da Meta procjene nisu nužno međusobno isključive, što znači da ista osoba može biti uključena u procjene za više jezika istovremeno, osobito ako govori više jezika ili ima postavke sučelja na jednom jeziku a komunicira na drugome. To znači da zbroj procjena po jezicima nije ekvivalentan ukupnom broju korisnika u Hrvatskoj.

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
                            Pri odabiru lokacije, Meta procjenjuje korisnike koji provode vrijeme u Hrvatskoj, kao što su ljudi koji tu žive ili su nedavno tu bili.
                            Polazni kriterij za odabir jezika je MUP-ova lista top 10 stranih državljanstava, a radi šire usporedbe i točnije procjene uključeni su najkorišteniji jezici u Hrvatskoj poput hrvatskog i engleskog, zatim službeni jezici susjednih i drugih europskih zemalja te svjetski jezici poput kineskog, japanskog itd.
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

                        <h2>Usporedba podataka Meta Ads Managera-a s brojem dozvola</h2>

                        <MetaBars />

                    </section>

                    <section className="section" >

                        <Rezultati />

                        <Objasnjenja />

                        <div className="space-y-2">

                            <button
                                onClick={() => setOpen1(!open1)}
                                className="flex items-center text-start gap-2 text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-lg w-full justify-between"
                            >
                                Broji li Meta korisnike WhatsAppa kao publiku?
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
                                <div className=" p-5">

                                    <div className="flex flex-col md:flex-row w-full md:max-h-[400px] gap-4 mb-10">

                                        <p className="paragraph md:pr-15 ">
                                            Iako je <b>WhatsApp</b> u Meta vlasništvu, vjerojatno nije uključen u procjene ako korisnik ne koristi druge aplikacije jer Meta u Hrvatskoj zasad ne može prikazivati oglase na WhatsApp-u, što će se uskoro promijeniti. Meta je u procesu lansiranja WhatsApp Business API-ja diljem svijeta, te je najavila da će koristiti lokaciju korisnika, jezik i podatke s Instagrama i Facebooka za prilagođavanje oglasa na WhatsAppu. Međutim, Europska komisija nedavno je formalno odredila WhatsApp kao Vrlo veliku online platformu (VLOP) prema Zakonu o digitalnim uslugama (DSA) te je postavljen rok do sredine svibnja 2026. da se WhatsApp uskladi s pravilima Europske unije namijenjenim <b>zaštiti privatnosti korisnika</b>. Ovaj potez dio je pojačanog regulatornog pritiska EU protiv glavnih američkih tehnoloških platformi. Administracija američkog predsjednika Donalda Trumpa prethodno je aspekte DSA označila kao "cenzuru" i potencijalno diskriminirajući tretman američkih tvrtki.
                                        </p>

                                        <img
                                            src="/meta-oglasi.jfif"
                                            alt="Meta AI"
                                            className="w-5/6 mx-auto md:w-1/5 h-auto rounded-2xl"
                                        />

                                        <img
                                            src="/meta-business.jfif"
                                            alt="Meta AI"
                                            className="w-5/6 mx-auto md:w-1/5 h-auto rounded-2xl "
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
                                        className="w-full h-auto my-10"
                                    />



                                    <p className="paragraph">
                                        Najnovije izvješće o transparentnosti otkriva razlike u zahtjevima  među regijama, ističući neke obrasce, ali i značajna odstupanja u strategijama vladinih zahtjeva za podacima, stopama uspjeha i pravnim okvirima.
                                        Primjerice, ističe se <b>Tajvan (11 500 korisnika) sa stopom učinkovitosti od čak 95%</b> i visokim brojem zahtjeva po glavi stanovnika, što odražava precizno ciljanje i snažnu pravnu jasnoću u vladinim zahtjevima.
                                        <b> SAD</b> (150 000 korisnika) ima umjerenu stopu zahtjeva po glavi stanovnika, ali vrlo velik broj ukupnih zahtjeva i visoku stopu uspjeha (88%).
                                        S druge strane, <b>Meksiko (11 700 korisnika) ima relativno nisku stopu uspjeha (55%)</b> što ukazuje na manje precizne zahtjeve ili strukturne izazove u dobivanju podataka.
                                        <b> Indija</b> (246 000 korisnika) i <b>Brazil</b> (112 000 korisnika) imaju ogromne populacije, ali relativno malo zahtjeva po glavi stanovnika.
                                        <b> Njemačka</b> (39 700 korisnika), <b>Francuska</b> (18 400 korisnika) i <b>Ujedinjeno Kraljevstvo</b> (14 400 korisnika) imaju umjerene razine zahtjeva po glavi stanovnika, ali visoke stope uspjeha. Francuska pokazuje neobičan obrazac, jer hitni zahtjevi premašuju formalne pravne.</p>


                                    <p className="paragraph"><b>Hrvatska</b> je u 2025. bila na 52. mjestu prema ukupnom broju zahtjeva (141), uključujući 228 korisnika, a na 13. mjestu prema postotku odobrenih zahtjeva (84%). Podaci za Hrvatsku:</p>




                                    <img
                                        src="/meta-cro-type.png"
                                        alt="Meta Croatia"
                                        className="w-full h-auto "
                                    />


                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="section mt-10" >

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


                    <section className="section" >

                        <h2>Zaključak</h2>

                        <p className="paragraph">
                            Možemo li dakle koristiti Meta procjene za provjeru službenih podataka? Ukratko odgovor je ne, barem ne izravno. Ova analiza pokazuje da Meta podaci mogu biti koristan dopunski izvor za procjenu migrantskih zajednica, ali ne mogu zamijeniti službene evidencije. Procjena broja govornika bengalskog je dokaz u prilog točnosti MUP-ovih podataka. Može se pretpostaviti da MUP i Meta pokazuju približno iste podatke pod uvjetom da skupina pretežno koristi svoj materinski jezik na Meta platformama, nema prekograničnog kretanja i Meta je dominantna platforma. Odstupanja kod balkanskih i azijskih skupina nisu greška već odraz geografske blizine, jezičnih karakteristika i različitih ponašanja, kao što su putovanja i izbor platformi. Meta u svoju procjenu uključuje prekogranične putnike, sezonske radnike i turiste koji koriste određeni jezik, dok MUP pokazuje broj osoba prema državljanstvu s dozvolom za rad i boravak. Potencijalna objašnjenja trebalo bi dodatno ispitati, primjerice anketiranjem o korištenju društvenih mreža i jezičnim postavkama. Možda je bolje pitanje mogu li nas promjene u procjenama upozoriti kada se nešto mijenja, prije nego što statistika to potvrdi.
                        </p>

                    </section>


                    <section className="section" >

                        <p className="paragraph">
                            Vizualizacije služe samo u obrazovne i istraživačke svrhe.
                            Prikazani podaci iz Meta Marketing API-ja su agregirani i ne sadrže osobne ili identificirajuće informacije.
                            Prikazane uvide služe analitičkoj demonstraciji i nisu namijenjene komercijalnoj upotrebi.
                        </p>

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

                            <li>
                                <span> {" "}
                                    <a href="https://www.facebook.com/business/help/1665333080167380?id=176276233019487"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Meta: About Estimated Audience Size </a>
                                </span>
                            </li>

                            <li>
                                <span> {" "}
                                    <a href="https://transparency.meta.com/reports/government-data-requests/country/HR/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Meta Government Requests for User Data: Croatia </a>
                                </span>
                            </li>



                        </ul>

                    </section>

                </div >

            </main >

        </>
    );
}
