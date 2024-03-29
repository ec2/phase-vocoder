function f0_est = getpitchgraph(filename)
  [snd,fs] = audioread(filename);

  %convert from stereo to mono
  if(size(snd,2) == 2)
      snd = snd(:,2);
  elseif(size(snd,1) == 2)
      snd = snd(1,:);
  end
  t = (0:length(snd)-1)/fs;

  % add noise
  snr = 5;
  noise = (mean(abs(snd)))*(10^(-snr/20)) * 0.1*randn(1,length(t))';
  snd = snd + noise;
  
  %convert to a row vector
  if(iscolumn(snd) == 1)
      snd = snd';
  end

  %ground truth frequency labels
  %f = [220*ones(1,len(1)), 233.08 * ones(1,len(2)), 164.81 * ones(1,len(3)), 196 * ones(1,len(4))];


  % Actual code
  [f0_est,amp,phi1,x_est] = eckf_pitch(snd, fs, 8, 8);
  time = (0:length(x_est)-1)/fs;
  figure;
  plot(time, f0_est, 'r');grid on; hold off;
  xlabel('Time');ylabel('Estimated f0 (Hz)');

endfunction