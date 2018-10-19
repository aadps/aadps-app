#!/bin/sh
cd android
./gradlew assembleRelease
scp app/build/outputs/apk/release/app-armeabi-v7a-release.apk root@aadps.net:/var/www/aadps2/app.apk
cd ..
