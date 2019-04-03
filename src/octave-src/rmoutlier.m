

function [res] = rmoutlier(x,fill,median,opposite)

	if nargin<4
		opposite=0;
	end
	if nargin<3
		median=0;
	end
	if nargin<2
		fill=0;
	end

if ~isvector(x) & ismatrix(x)
	res = [];
	for i=1:columns(x)
		rr = rmoutlier(x(:,i),fill,median,opposite);
		res = [res rr];
	end

elseif isvector(x)
	wo = x;
	ou = find(x == outlier(x,opposite));
  for i=1:length(ou)
    if (ou(i) > length(x))
      continue;
    wo(ou(i)) = [];
  end

       if ~fill
		res = wo;
	else
       		res = x;
 		for i=1:length(ou)
			if median 
			res(ou(i)) = median(wo);
			else
			res(ou(i)) = mean(wo);
			end
		end
  	end
end
end
