x = wavread('toneb3.wav');

out = transformsignal(x, [1, length(x)], [.5]);
wavwrite(out, 'out.wav');

