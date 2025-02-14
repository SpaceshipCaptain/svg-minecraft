# svg-minecraft
**minecraft.wiki SVGs** should contain all the SVGs uploaded to the [minecraft.wiki and you can view that list here](https://minecraft.wiki/w/User:SpaceshipCaptain/SVG_Blocks).
- The titles should match the files on the minecraft.wiki, so I can easily upload new versions if needed.

This is just a random side project, I don't really have a plan.

# Problems
**SVGs were not really designed to be used like this.**
- These SVGs won't render correctly on Safari. Safari doesn't seem to support inline css inside of svg files.
- These SVGs are created by taking the 16x16 textures and applying a matrix transform to make the textures look like 3D blocks. The faces should be perfectly aligned, but they actually render with tiny gaps inbetween the faces.
    - I fixed this by wrapping the block in a <g> tag and then re-rendering the block several times over top itself. This seems to fill in the tiny gaps. I don't love this solution,but it's simple and it works.
        - This "fix" also forced me to use an odd SVG structure for the tinted blocks, becuase obviously you can't just re-render tinted blocks over top themselves.
- `<clipPath>` tags are not pixel perfect. They will grab a tiny bit of color from the next row of pixels when they shouldn't. It's not too bad, but you will see it if you look closely. I have no idea how to fix this.
    - This seems to be a core SVG issue becuase if the same problem happens if you are animating a block by changing the y value of a texture. Might have something to do with the inline css interacting with the SVG renderer but that's a guess.

I recommend [this vscode extension](https://marketplace.visualstudio.com/items?itemName=jock.svg) for making or editing SVGs. 


NOT AN OFFICIAL MINECRAFT [PRODUCT/SERVICE/EVENT/etc.]. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT