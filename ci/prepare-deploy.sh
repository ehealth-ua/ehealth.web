#!/bin/sh
openssl aes-256-cbc -K $encrypted_d422cd97315f_key -iv $encrypted_d422cd97315f_iv -in eHealth-d14f79f426fb.json.enc -out eHealth-d14f79f426fb.json -d
gcloud auth activate-service-account --key-file=$TRAVIS_BUILD_DIR/eHealth-d14f79f426fb.json
gcloud container clusters get-credentials dev --zone europe-west1-d --project ehealth-162117
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash
git clone https://github.com/edenlabllc/ehealth.charts.git charts
