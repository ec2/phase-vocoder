
function snd_mono = convert_mono(snd)
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
  snd_mono = snd;
endfunction