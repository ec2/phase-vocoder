#! /usr/bin/octave -qf
pkg load signal; 
pkg load statistics;

uid = argv(){1};
filename = sprintf("/tmp/%s/%s.wav", uid, uid);
[x, fs] = audioread(filename);
f0_est = getpitch(x, fs);
f0_est = decimate(f0_est, 10)
filename=sprintf('/tmp/%s/%s.csv', uid, uid);    
csvwrite(filename, f0_est)