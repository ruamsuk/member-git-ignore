# MemberGitIgnore, Member

ใช้งานจริงแล้วนะ

### รายละเอียด

โปรเจคนี้ คือ ระบบสมาชิกที่ไม่ได้เพิ่มจำนวนสมาชิก มีแต่จะลดลงเนื่องจากเสียชีวิตไป เป็นการปรับปรุงเสียใหม่ โดยแรกเริ่มจะเป็น Angular 6 front end ส่วน Back end 
เป็น PHP ล่าสุดก็ได้พัฒนาเป็น Firestore และใช้ Google Cloud Hosting  

## Deploy
+ What do you want to use as your public directory? dist

+  Configure as a single-page app (rewrite all urls to /index.html)? No

+ Set up automatic builds and deploys with GitHub? No
+  Wrote dist/404.html
   
+ File dist/index.html already exists. Overwrite? No
  (อย่าให้เขียนทับ index.html เด็ดขาด ตอบ No)
+ ถ้ากำหนดให้เขียนทับ จะไม่เห็นหน้าเว็บของเรา แต่จะเป็นหน้าของ Firebase แทนนะ

# Environment
+ เมื่อจะ build project ให้ copy environment file จากโฟลเดอร์ env-file มาไว้ในโฟลเดอร์ environments

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
