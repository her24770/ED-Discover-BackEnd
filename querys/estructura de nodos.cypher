CREATE (:User { name:"String", email:"String(Unique)", date_Birth:"Date", password:"String" });

CREATE (:Song { name:"String", code: "String(Unique)", cover: "String(Url)",producer:"String",writer:"String",bpm:0,reproductions :0,likes:0});

CREATE (:Artist { name:"String", biography:"String", photo:"String(Url)" });

CREATE (:Emotion { feeling:"String", danceable:0});

CREATE (:Gender { name:"String", description:"String" });

CREATE (:Language { language:"String"});

CREATE (:Album { name:"String", nSongs:0, cover:"String(Url)", duration:0,likes:0 });

CREATE (:Year { startYear:0, finishYear:0});

CREATE (:Region { country:"String", continent:"String" });