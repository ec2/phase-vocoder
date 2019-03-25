function tsig = correctsingle(x, factor, decimal)
  pkg load signal
  e = pvoc(x, factor);
  [p,q] = rat(length(x)/length(e), decimal);
  tsig = resample(e, p, q);
  length(tsig)
  if(length(tsig) > length(x))
    tsig = tsig(1:length(x));
  elseif(length(tsig) < length(x))
    tsig = horzcat(tsig, x(length(tsig):end));
  endif
endfunction
