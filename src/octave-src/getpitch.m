function f0_est = getpitch(snd, fs)
  [f0_est,amp,phi1,x_est] = eckf_pitch(snd, fs, 8, 8);
endfunction
