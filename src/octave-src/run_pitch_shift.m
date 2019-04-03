#! /usr/bin/octave -qf
pkg load signal; 
pkg load statistics;
pkg load outliers;
uid = argv(){1}
pitch_filename = sprintf("/tmp/%s/%s_orig.csv", uid, uid);
audio_filename = sprintf("/tmp/%s/%s.wav", uid, uid);
out_filename = sprintf("/tmp/%s/%s_shifted.wav", uid, uid);
correction_times = [];
correct_pitches = {};
arg_list = argv ();
start_time = time();
for i = 0:((nargin - 1) / 3) - 1
      	correction_times = vertcat(correction_times, [str2num(arg_list{2 + 3*i + 0}) str2num(arg_list{2 + 3*i + 1})]);
        correct_pitches{i + 1} = arg_list{2 + 3*i + 2};
endfor
printf("parse time: %d", time() - start_time)
start_time = time();
f0_est = load("-ascii", pitch_filename);
printf("pitch read time: %d", time() - start_time)
start_time = time();
[x, fs] = audioread(audio_filename);
x = convert_mono(x);
printf("audio read time: %d", time() - start_time)
start_time = time();
out = transformsignal(x, fs, f0_est, correction_times, correct_pitches);
printf("transform time: %d", time() - start_time)
audiowrite(out_filename, out, fs);
