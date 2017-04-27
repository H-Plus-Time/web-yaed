#include <opencv2/opencv.hpp>
#include "common.h"
#include "EllipseDetectorYaed.h"
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
using namespace emscripten;
#endif

extern "C" {
    // one of emscripten's limitations is that it cannot simultaneously 
    // provide raw pointer access (the uchar ptr) AND exotic typebinding
    // (the vector<Ellipse>). In situations such as this, the only feasible 
    // workaround is to return a raw pointer, then pass that to a custom 
    // constructor (see the EMSCRIPTEN_BINDINGS section).
    // It is *extremely* important that the pointer is for a value on the 
    // heap rather than the local scope stack - the latter gets reclaimed 
    // immediately. Hence, use the new operator.
    vector<Ellipse> * detect(unsigned char * data, int width, int height) {
        vector<Ellipse> * ellsYaed = new vector<Ellipse>();
        Mat image = Mat(width, height, CV_8UC4, data);
		Size sz = {width, height};
		// Convert to grayscale
		Mat1b gray;
		cvtColor(image, gray, CV_RGBA2GRAY);
		
		// Parameters Settings (Sect. 4.2)
		int		iThLength = 16;
		float	fThObb = 3.0f;
		float	fThPos = 1.0f;
		float	fTaoCenters = 0.05f;
		int 	iNs = 16;
		float	fMaxCenterDistance = sqrt(float(sz.width*sz.width + sz.height*sz.height)) * fTaoCenters;

		float	fThScoreScore = 0.7f;

		// Other constant parameters settings. 

		// Gaussian filter parameters, in pre-processing
		Size	szPreProcessingGaussKernelSize = Size(5, 5);
		double	dPreProcessingGaussSigma = 1.0;

		float	fDistanceToEllipseContour = 0.1f;	// (Sect. 3.3.1 - Validation)
		float	fMinReliability = 0.5;	// Const parameters to discard bad ellipses


		// Initialize Detector with selected parameters
		CEllipseDetectorYaed yaed;
		yaed.SetParameters(szPreProcessingGaussKernelSize,
			dPreProcessingGaussSigma,
			fThPos,
			fMaxCenterDistance,
			iThLength,
			fThObb,
			fDistanceToEllipseContour,
			fThScoreScore,
			fMinReliability,
			iNs
			);


		// Detect
		yaed.Detect(gray, *ellsYaed);

        // for debugging purposes
		// vector<double> times = yaed.GetTimes();
		// cout << "--------------------------------" << endl;
		// cout << "Execution Time: " << endl;
		// cout << "Edge Detection: \t" << times[0] << endl;
		// cout << "Pre processing: \t" << times[1] << endl;
		// cout << "Grouping:       \t" << times[2] << endl;
		// cout << "Estimation:     \t" << times[3] << endl;
		// cout << "Validation:     \t" << times[4] << endl;
		// cout << "Clustering:     \t" << times[5] << endl;
		// cout << "--------------------------------" << endl;
		// cout << "Total:	         \t" << yaed.GetExecTime() << endl;
		// cout << "--------------------------------" << endl;
        return ellsYaed;
    }

}

vector<Ellipse> * vectorFromIntPointer(uintptr_t ptr) {
    return reinterpret_cast<vector<Ellipse> *>(ptr);
}

EMSCRIPTEN_BINDINGS(not_important) {
    value_object<Ellipse>("Ellipse")
        .field("xc", &Ellipse::_xc)
        .field("yc", &Ellipse::_yc)
        .field("score", &Ellipse::_score)
        .field("orientation", &Ellipse::_rad)
        .field("a", &Ellipse::_a)
        .field("b", &Ellipse::_b)
        ;
    register_vector<Ellipse>("VectorEllipse").constructor(&vectorFromIntPointer, allow_raw_pointers());
}