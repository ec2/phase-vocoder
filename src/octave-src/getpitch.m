function f0_est = getpitch(snd, fs)

  %convert from stereo to mono
  if(size(snd,2) == 2)
      snd = snd(:,2);
  elseif(size(snd,1) == 2)
      snd = snd(1,:);
  end

  %convert to a row vector
  if(iscolumn(snd) == 1)
      snd = snd';
  end
  [f0_est,amp,phi1,x_est] = eckf_pitch(snd, fs, 8, 8);
endfunction
