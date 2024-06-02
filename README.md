# Webová aplikácia a obslužné prostredie na vyhodnocovanie pohybu cyklistov

## Úvodná stránka
- Obsahuje navigačné menu s možnosťou prihlásenia. V prípade, že je používateľ prihlásený, menu sa prispôsobí a prihlásenie sa zmení na nastavenia
<img width="1425" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/d773a9d3-b640-4de2-aca7-65e8744f1982">

### Pridávanie sčítača v nastaveniach s otvorenou mapou:
- Názov sčítača musí byť unikátny, čo kontroluje samotný Firebase
- Zadávanie API je aktuálne nastavené na tvar: <TVOJA_API>/query?db=sensor_data&q=SELECT * FROM sensor_data
- Používateľ má možnosť si otvoriť aj mapu a v nej zadať presné umiestnenie zariadenia
- Pred pridaním API je nutné otestovať pripojenie, pokiaľ nebude úspešné, nie je možné pridať zariadenie
<img width="716" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/2565f652-d932-42be-85d3-97ced64ac0da">

### Moje sčítače
- Tu je možné si prehliadať svoje sčítače, ich nastavené atribúty a stav batérie
- Na prvom sčítači je simulovaná úprava sčítača
<img width="646" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/73b58505-26e9-4ab3-bdfb-ed0df4eff1a0">

## Vývoj počtu cyklistov v danej lokalite
- Tu je možné zobraziť údaje z jedného sčítača
- Je možné zvoliť si rozsah dátumov a interval zobrazenia údajov
- Reprezentovaná teplota ovzdušia je prevzatá priamo zo senzoru, údaje o počasí poskytované z emeteo API budú v ďalších grafoch
<img width="1426" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/1e9bf04b-3af8-463e-a6f0-db1332d66269">

## Porovnania lokacii
- Možnosť výberu a porovnania medzi všetkými zariadeniami
- Dostupné sú aj údaje o teplote a zrážkach na danej lokalite
- Používateľ má možnosť vybrať si lokality, časový horizont a vypnúť/zapnúť zobrazovanie počasia
<img width="990" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/7631d204-16b6-41e5-bdec-e34f07181ced">

### Popis grafov  
- Prvý graf hovorí o priemerne najviac vyťaženom dni z vybraného časového rozsahu, t.j. že sa spočítajú dni každého dňa v týždni a vyberie sa najviac vyťažený deň
- Druhý graf je presný opak, tam sa vyberá v priemere najmenej vyťažený deň v týždni
- Tretí graf robí priemer, nerozdeľuje na základe dní, ale reprezentuje priemer prejazdov za konkrétnu hodinu v danom dni
<img width="1425" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/bba57e0d-2580-44be-ad61-e34530cd4242">

## Mapa
- Na konci stránky je dostupná mapa s prehľadom všetkých sčítačov, kde je možné pozrieť, kde sa presne nachádzajú, a taktiež sa pozrieť na počet prejazdov v dnešnom dni
<img width="1428" alt="image" src="https://github.com/MilanKubackaM/bakalarka/assets/82218017/4615680e-fd4a-4c05-b3a6-8f22b89c3551">


