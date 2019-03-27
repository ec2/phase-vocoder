#! /usr/bin/octave -qf
pkg load signal; 
pkg load statistics;

uid = argv(){1};
filename = sprintf("/tmp/%s/%s.wav", uid, uid);
[x, fs] = audioread(filename);
f0_est = getpitch(x, fs);
f0_est_ds = decimate(f0_est, 10);
filename_ds=sprintf('/tmp/%s/%s.csv', uid, uid);  
filename_orig=sprintf('/tmp/%s/%s_orig.csv', uid, uid);  
csvwrite(filename_ds, f0_est_ds)
csvwrite(filename_orig, f0_est)