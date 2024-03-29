function tsig = transformsignal(x, ranges, factors)
  tsig = x;
  for i = 1:size(ranges)(1)
    l = ranges(i,1);
    r = ranges(i,2);
    tsig(l:r) = correctsingle(x(l:r), factors(i), 0.000000000001);
  endfor
endfunction
