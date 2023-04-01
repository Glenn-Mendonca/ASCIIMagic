#include <string>
#include <vector>
#include <math.h>
#include <stdlib.h>

const std::string density = "Ñ@#W$9876543210?!abc;:+=-,._ ";
const int densityChars = density.length();
char *charASCII;

extern "C" char *convertToASCII(std::vector<int> image, int height, int width, bool isDark)
{
    std::string ascii = "";
    for (int h = 0; h < height; h++)
    {
        for (int w = 0; w < width; w++)
        {
            int indx = (h * width + w) * 4;
            double avg = (image[indx] + image[indx + 1] + image[indx + 2]) / 3.0;
            ascii += density[floor((((isDark) ? (255 - avg) : avg) / 256) * densityChars)];
        }
        ascii += "\n";
    }
    charASCII = (char *)malloc(sizeof(char) * (ascii.length() + 1));
    strcpy(charASCII, ascii.c_str());
    return charASCII;
}

int main()
{
    return 0;
}