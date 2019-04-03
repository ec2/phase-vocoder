function tsig = transformsignal(x, fs, f0_est, ranges, correct_notes)
  notes = getnotes();
  tsig = x;
  ranges
  correct_notes
  for i = 1:size(ranges)(1)
    l = ranges(i,1) * fs + 1;
    r = ranges(i,2) * fs;
    desired_freq = getfield(notes, correct_notes{1, i});
    f0_clip = f0_est(l:r);
    f0_mean = mean(f0_clip)
    for idx = 1:length(f0_clip);
        if (f0_clip(idx) < 10)
           f0_clip(idx) = f0_mean;
        end
    end
    avg_freq = mean(f0_clip);
    printf("shifting an avg freq of %d Hz between %d sec and %d sec to %d Hz", avg_freq, ranges(i, 1), ranges(i, 2), desired_freq)
    frac =  avg_freq / desired_freq;
    tsig(l:r) = correctsingle(x(l:r), frac, 0.0000001);
  endfor
endfunction



