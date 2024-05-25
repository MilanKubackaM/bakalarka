# Bakalarka

## Uvodna stranka
- Obsahuje navigacne menu s moznostou prihlasenia, v pripade ze je uzivatel prihlaseny, menu sa prisposobi a prihlasenie sa zmeni na nastavenia 
<img width="1427" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/cc223978-c4ae-45c6-a753-c3976417aa5c">

### Pridavanie scitaca v nastaveniach s otvorenou mapou: 
- Nazov scitaca musi byt unikatny, co kontroluje samotny firebase
- Zadavanie API je aktualne nastavene na tvar: <TVOJA_API>/query?db=sensor_data&q=SELECT * FROM sensor_data`
- Uzivatel ma moznost si otvorit aj mapu a v nej zadat presne umeistenie zariadenia
- Pred pridanim API je nutne otestovat pripojenie, pokym nebude uspesne, nieje mozne pridat zariadenie
<img width="794" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/949d819e-75e5-4b11-8e49-91fc29873e28">

### Moje scitace
- Tu je mozne si prehlaidat svoje scitace, upravit ich atributy pripadne vymazat
<img width="648" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/2d908224-118a-4b51-99c9-06e53c6c64fd">

## Vyvoj poctu cyklistov v danej lokalite
- Tu je mozne zobrazit udaje z jedneho scitaca
- Je mozne svolit si rozsah datumov a interval zobrazenia udajov
- Reprezentovana teplota ovzdusia je prevzata priamo zo senzoru, udaje o pocasi poskytovane z emeteo API budu v dalsich grafoch
<img width="1435" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/b8c51e31-86d5-43ff-87fe-e8e8d025840a">

## Porovnania lokacii
- Moznost vyberu a porovnania medzi vsetkymi zariadeniami
- Dostupne su aj udaje o teplote a zrazkach na danej lokalite
- Uzivatel ma moznost vybrat si lokacie, casovy horizont a vypnut/zapnut zobrazovanie pocasia
- <img width="857" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/a683b557-82e5-404e-8a39-641051dbd3bd">


### Popis grafov  
- Prvy graf hovori o priemerne najviac vytazenom dni z vybraneho casoveho rozsahu, t.z. ze sa spocitaju dni kazdeho dna v tyzdni, a vyberie sa najviac vytazeny den
- Druhy graf je presny opak, tam sa vybera v priemere najmenej vytazeny den v tyzdni
- Treti graf robi priemer, nerozdeluje na zaklade dni, ale reprezentuje priemer prejazdov za konkretnu hodinu v danom dni
<img width="1425" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/8bef4b14-073a-43a6-bbe4-d4df54a48ba3">

## Mapa
- Na konci stranky je dostupna mapa s prehladom vsetkych scitacov, kde je mozne pozriet kde sa presne nachadzaju a taktiez sa pozriet na pocet prejazdov v dnesnom dni 
<img width="1425" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/e0b5bf00-0f06-48fc-9e22-c3bc408ce43c">


